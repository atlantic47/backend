import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation } from '../database/entities/consultation.entity';
import { ConsultationRecommendation } from '../database/entities/consultation-recommendation.entity';
import { PaymentGateway } from '../database/entities/payment-gateway.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';

@Injectable()
export class ConsultationsService {
    constructor(
        @InjectRepository(Consultation)
        private consultationsRepository: Repository<Consultation>,
        @InjectRepository(ConsultationRecommendation)
        private recommendationsRepository: Repository<ConsultationRecommendation>,
        @InjectRepository(PaymentGateway)
        private gatewaysRepository: Repository<PaymentGateway>,
    ) { }

    async create(createConsultationDto: CreateConsultationDto): Promise<Consultation> {
        const consultation = this.consultationsRepository.create(createConsultationDto);
        return this.consultationsRepository.save(consultation);
    }

    async findOne(id: string): Promise<Consultation | null> {
        return this.consultationsRepository.findOne({
            where: { id },
            relations: ['recommendations', 'recommendations.gateway'],
        });
    }

    async generateRecommendations(consultationId: string): Promise<ConsultationRecommendation[]> {
        const consultation = await this.consultationsRepository.findOne({
            where: { id: consultationId },
        });

        if (!consultation) {
            throw new Error('Consultation not found');
        }

        // Get all gateways with their relations
        const allGateways = await this.gatewaysRepository.find({
            relations: ['countries', 'currencies'],
        });

        const scoredGateways = allGateways.map((gateway) => {
            let score = 0;
            const reasons: string[] = [];

            // Country Match (30 points)
            const countryMatches = consultation.countries_needed.filter((c) =>
                gateway.countries?.some((gc) => gc.code === c),
            );
            if (countryMatches.length > 0) {
                const countryScore = (countryMatches.length / consultation.countries_needed.length) * 30;
                score += countryScore;
                reasons.push(
                    `Supports ${countryMatches.length}/${consultation.countries_needed.length} of your countries`,
                );
            }

            // Currency Match (20 points)
            const currencyMatches = consultation.currencies_needed.filter((c) =>
                gateway.currencies?.some((gc) => gc.code === c),
            );
            if (currencyMatches.length > 0) {
                const currencyScore = (currencyMatches.length / consultation.currencies_needed.length) * 20;
                score += currencyScore;
                reasons.push(
                    `Supports ${currencyMatches.length}/${consultation.currencies_needed.length} currencies`,
                );
            }

            // Integration Type Match (15 points)
            const integrationMatches = consultation.integration_types_preferred.filter((it) =>
                gateway.integration_type?.includes(it),
            );
            if (integrationMatches.length > 0) {
                score += 15;
                reasons.push(`Offers ${integrationMatches.join(', ')} integration`);
            }

            // Business Type Match (10 points)
            const businessTypeMatches = consultation.business_types.filter((bt) =>
                gateway.business_type?.includes(bt),
            );
            if (businessTypeMatches.length > 0) {
                score += 10;
                reasons.push(`Specializes in ${businessTypeMatches.join(', ')}`);
            }

            // Active Offer Bonus (10 points)
            if (gateway.startup_offer) {
                score += 10;
                reasons.push(`Startup offer: ${gateway.startup_offer}`);
            }

            // Market Share / Popularity (10 points)
            if (gateway.fit_score > 80) {
                score += 10;
                reasons.push('Highly rated by similar businesses');
            }

            // Low Fees Bonus (5 points)
            if (gateway.local_fee_percentage && gateway.local_fee_percentage < 3) {
                score += 5;
                reasons.push('Competitive transaction fees');
            }

            return { gateway, score, reasons };
        });

        // Sort by score, take top 10
        const topRecommendations = scoredGateways
            .filter((s) => s.score > 20) // Minimum score threshold
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        // Save to database
        const savedRecommendations = await Promise.all(
            topRecommendations.map((rec) =>
                this.recommendationsRepository.save({
                    consultation,
                    gateway: rec.gateway,
                    score: rec.score,
                    reasons: rec.reasons,
                }),
            ),
        );

        // Update consultation status
        await this.consultationsRepository.update(consultationId, {
            status: 'analyzed',
        });

        return savedRecommendations;
    }

    async getRecommendations(consultationId: string): Promise<ConsultationRecommendation[]> {
        return this.recommendationsRepository.find({
            where: { consultation: { id: consultationId } },
            relations: ['gateway', 'gateway.countries', 'gateway.currencies'],
            order: { score: 'DESC' },
        });
    }
}
