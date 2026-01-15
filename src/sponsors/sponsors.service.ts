import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThan, IsNull } from 'typeorm';
import { Sponsor } from '../database/entities/sponsor.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SponsorsService {
    private readonly MAX_SPONSORS = 20;
    private readonly SPONSOR_DURATION_DAYS = 30;

    constructor(
        @InjectRepository(Sponsor)
        private sponsorRepository: Repository<Sponsor>,
    ) { }

    /**
     * Get active sponsors sorted by expiration date (ending soonest first)
     * This ensures expiring ads get more visibility at the top of rotation
     */
    async getActiveSponsors() {
        const now = new Date();

        const sponsors = await this.sponsorRepository
            .createQueryBuilder('sponsor')
            .leftJoinAndSelect('sponsor.gateway', 'gateway')
            .where('sponsor.status = :status', { status: 'active' })
            .andWhere('sponsor.approval_status = :approval_status', { approval_status: 'approved' })
            .andWhere('sponsor.end_date > :now', { now })
            .orderBy('sponsor.end_date', 'ASC') // Expiring soonest first
            .limit(this.MAX_SPONSORS)
            .getMany();

        return sponsors;
    }

    /**
     * Get count of available advertisement slots
     */
    async getAvailableSlots(): Promise<number> {
        const activeCount = await this.sponsorRepository.count({
            where: {
                status: 'active',
                end_date: MoreThan(new Date()),
            },
        });

        return Math.max(0, this.MAX_SPONSORS - activeCount);
    }

    /**
     * Get available slots with upcoming expiration information
     */
    async getAvailableSlotsWithExpirations() {
        const now = new Date();
        const activeCount = await this.sponsorRepository.count({
            where: {
                status: 'active',
                end_date: MoreThan(now),
            },
        });

        const available = Math.max(0, this.MAX_SPONSORS - activeCount);

        // Get upcoming expirations in the next 30 days
        const thirtyDaysFromNow = new Date(now);
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const upcomingExpirations = await this.sponsorRepository
            .createQueryBuilder('sponsor')
            .where('sponsor.status = :status', { status: 'active' })
            .andWhere('sponsor.end_date > :now', { now })
            .andWhere('sponsor.end_date <= :thirtyDays', { thirtyDays: thirtyDaysFromNow })
            .orderBy('sponsor.end_date', 'ASC')
            .getMany();

        // Calculate days until next expiration
        let nextAvailable: { date: Date; daysUntil: number; count: number } | null = null;
        if (available === 0 && upcomingExpirations.length > 0) {
            const nextExpiration = upcomingExpirations[0];
            const daysUntil = Math.ceil((nextExpiration.end_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            nextAvailable = {
                date: nextExpiration.end_date,
                daysUntil,
                count: 1,
            };
        }

        return {
            available,
            total: this.MAX_SPONSORS,
            occupied: this.MAX_SPONSORS - available,
            nextAvailable,
            upcomingExpirations: upcomingExpirations.map(s => ({
                endDate: s.end_date,
                daysUntil: Math.ceil((s.end_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
            })),
        };
    }

    /**
     * Create a new sponsor with validation
     */
    async createSponsor(createSponsorDto: {
        gateway_id: number;
        vibe_score?: number;
        primary_corridor?: string;
        verified_2026?: boolean;
        monthly_price?: number;
    }) {
        // Check if slots are available
        const availableSlots = await this.getAvailableSlots();
        if (availableSlots <= 0) {
            throw new BadRequestException('No advertisement slots available. All 20 slots are currently occupied.');
        }

        // Calculate start and end dates
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + this.SPONSOR_DURATION_DAYS);

        const sponsor = this.sponsorRepository.create({
            ...createSponsorDto,
            start_date: startDate,
            end_date: endDate,
            status: 'pending',
            approval_status: 'pending',
            submitted_at: new Date(),
            display_order: 0,
            is_featured: true,
        });

        return await this.sponsorRepository.save(sponsor);
    }

    /**
     * Get featured sponsors for the carousel (legacy method)
     */
    async getFeaturedSponsors() {
        return this.getActiveSponsors();
    }

    /**
     * Cron job to expire sponsors that have passed their end date
     * Runs every day at midnight
     */
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async expireSponsors() {
        const now = new Date();

        const result = await this.sponsorRepository
            .createQueryBuilder()
            .update(Sponsor)
            .set({ status: 'expired' })
            .where('end_date <= :now', { now })
            .andWhere('status = :status', { status: 'active' })
            .execute();

        console.log(`Expired ${result.affected} sponsor(s)`);
        return result.affected;
    }

    /**
     * Get sponsor by ID with gateway details
     */
    async findOne(id: number) {
        return await this.sponsorRepository.findOne({
            where: { id },
            relations: ['gateway'],
        });
    }

    async update(id: number, updateSponsorDto: any) {
        await this.sponsorRepository.update(id, updateSponsorDto);
        return await this.sponsorRepository.findOne({
            where: { id },
            relations: ['gateway'],
        });
    }

    async remove(id: number) {
        await this.sponsorRepository.delete(id);
    }
}
