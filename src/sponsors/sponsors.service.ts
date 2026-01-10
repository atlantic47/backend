import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThan, IsNull } from 'typeorm';
import { Sponsor } from '../database/entities/sponsor.entity';

@Injectable()
export class SponsorsService {
    constructor(
        @InjectRepository(Sponsor)
        private sponsorRepository: Repository<Sponsor>,
    ) { }

    async create(createSponsorDto: any) {
        const sponsor = this.sponsorRepository.create(createSponsorDto);
        return await this.sponsorRepository.save(sponsor);
    }

    /**
     * Get featured sponsors for the carousel
     * Max 20 sponsors, ordered by display_order
     * Only include active sponsors (not expired)
     */
    async getFeaturedSponsors() {
        const now = new Date();

        const sponsors = await this.sponsorRepository.find({
            where: [
                { is_featured: true, expires_at: MoreThan(now) },
                { is_featured: true, expires_at: IsNull() },
            ],
            relations: ['gateway'],
            order: { display_order: 'ASC' },
            take: 20,
        });

        return sponsors;
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
