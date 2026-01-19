import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Visitor } from '../database/entities/visitor.entity';
import * as crypto from 'crypto';
import * as geoip from 'geoip-lite';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Visitor)
        private visitorRepository: Repository<Visitor>,
    ) { }

    /**
     * Hash IP address for privacy
     */
    private hashIp(ip: string): string {
        return crypto.createHash('sha256').update(ip).digest('hex');
    }

    /**
     * Get country from IP address
     */
    private getCountryFromIp(ip: string): { code: string; name: string } {
        const geo = geoip.lookup(ip);
        if (geo && geo.country) {
            return {
                code: geo.country,
                name: this.getCountryName(geo.country),
            };
        }
        // Fallback for local development - default to Kenya
        // In production, this will use actual IP geolocation
        return { code: 'KE', name: 'Kenya' };
    }

    /**
     * Get country name from code
     */
    private getCountryName(code: string): string {
        const countries: Record<string, string> = {
            US: 'United States',
            GB: 'United Kingdom',
            CA: 'Canada',
            DE: 'Germany',
            FR: 'France',
            IN: 'India',
            CN: 'China',
            JP: 'Japan',
            BR: 'Brazil',
            AU: 'Australia',
            NG: 'Nigeria',
            KE: 'Kenya',
            ZA: 'South Africa',
            // Add more as needed
        };
        return countries[code] || code;
    }

    /**
     * Track a visitor session
     */
    async trackVisitor(
        sessionId: string,
        ip: string,
        userAgent?: string,
        referrer?: string,
    ): Promise<Visitor> {
        const ipHash = this.hashIp(ip);
        const country = this.getCountryFromIp(ip);

        let visitor = await this.visitorRepository.findOne({
            where: { session_id: sessionId },
        });

        if (visitor) {
            // Update existing visitor
            visitor.last_seen = new Date();
            visitor.page_views += 1;
            await this.visitorRepository.save(visitor);
        } else {
            // Create new visitor
            visitor = this.visitorRepository.create({
                session_id: sessionId,
                ip_hash: ipHash,
                country_code: country.code,
                country_name: country.name,
                user_agent: userAgent,
                referrer: referrer,
            });
            await this.visitorRepository.save(visitor);
        }

        return visitor;
    }

    /**
     * Get live visitors (active in last 5 minutes)
     */
    async getLiveVisitors(): Promise<any[]> {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const visitors = await this.visitorRepository
            .createQueryBuilder('visitor')
            .select('visitor.country_code', 'country_code')
            .addSelect('visitor.country_name', 'country_name')
            .addSelect('COUNT(*)', 'count')
            .where('visitor.last_seen > :time', { time: fiveMinutesAgo })
            .groupBy('visitor.country_code')
            .addGroupBy('visitor.country_name')
            .getRawMany();

        return visitors.map((v) => ({
            countryCode: v.country_code,
            countryName: v.country_name,
            count: parseInt(v.count),
            emoji: this.getCountryEmoji(v.country_code),
        }));
    }

    /**
     * Get country flag emoji
     */
    private getCountryEmoji(countryCode: string): string {
        if (countryCode === 'XX') return '🌍';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map((char) => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    }

    /**
     * Get dashboard overview stats
     */
    async getDashboardStats(): Promise<any> {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const [todayVisitors, yesterdayVisitors, weekVisitors, totalVisitors] =
            await Promise.all([
                this.visitorRepository.count({
                    where: { first_seen: MoreThan(today) },
                }),
                this.visitorRepository.count({
                    where: { first_seen: MoreThan(yesterday) },
                }),
                this.visitorRepository.count({
                    where: { first_seen: MoreThan(lastWeek) },
                }),
                this.visitorRepository.count(),
            ]);

        const liveVisitors = await this.getLiveVisitors();
        const liveCount = liveVisitors.reduce((sum, v) => sum + v.count, 0);

        return {
            liveVisitors: liveCount,
            todayVisitors,
            yesterdayVisitors,
            weekVisitors,
            totalVisitors,
            topCountries: liveVisitors.slice(0, 10),
        };
    }

    /**
     * Clean up old visitor records (older than 30 days)
     */
    async cleanupOldVisitors(): Promise<void> {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        await this.visitorRepository.delete({
            last_seen: MoreThan(thirtyDaysAgo),
        });
    }
}
