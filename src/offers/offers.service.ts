import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, IsNull } from 'typeorm';
import { FounderOffer } from '../database/entities/founder-offer.entity';

@Injectable()
export class OffersService {
    constructor(
        @InjectRepository(FounderOffer)
        private offerRepository: Repository<FounderOffer>,
    ) { }

    async create(createOfferDto: any) {
        const offer = this.offerRepository.create(createOfferDto);
        return await this.offerRepository.save(offer);
    }

    /**
     * Get founder offers with optional filtering by country, currency, crypto
     */
    async findAll(country?: string, currency?: string, crypto?: string) {
        const now = new Date();
        const queryBuilder = this.offerRepository.createQueryBuilder('offer')
            .leftJoinAndSelect('offer.gateway', 'gateway')
            .where('(offer.expires_at > :now OR offer.expires_at IS NULL)', { now });

        // Filter by country (if countries array is empty, it applies to all countries)
        if (country) {
            queryBuilder.andWhere(
                '(FIND_IN_SET(:country, offer.countries) > 0 OR offer.countries IS NULL OR offer.countries = "")',
                { country },
            );
        }

        // Filter by currency
        if (currency) {
            queryBuilder.andWhere(
                '(FIND_IN_SET(:currency, offer.currencies) > 0 OR offer.currencies IS NULL OR offer.currencies = "")',
                { currency },
            );
        }

        // Filter by crypto
        if (crypto) {
            queryBuilder.andWhere(
                '(FIND_IN_SET(:crypto, offer.crypto) > 0 OR offer.crypto IS NULL OR offer.crypto = "")',
                { crypto },
            );
        }

        return await queryBuilder.getMany();
    }

    async update(id: number, updateOfferDto: any) {
        await this.offerRepository.update(id, updateOfferDto);
        return await this.offerRepository.findOne({
            where: { id },
            relations: ['gateway'],
        });
    }

    async remove(id: number) {
        await this.offerRepository.delete(id);
    }
}
