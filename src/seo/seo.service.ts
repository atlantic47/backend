import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeoMetadata } from '../database/entities/seo-metadata.entity';
import { GatewaysService } from '../gateways/gateways.service';

export interface CreateSeoDto {
    page_route: string;
    title: string;
    description: string;
    keywords?: string;
    og_image?: string;
    og_title?: string;
    og_description?: string;
}

export interface UpdateSeoDto {
    title?: string;
    description?: string;
    keywords?: string;
    og_image?: string;
    og_title?: string;
    og_description?: string;
}

@Injectable()
export class SeoService {
    constructor(
        @InjectRepository(SeoMetadata)
        private seoRepository: Repository<SeoMetadata>,
        private gatewaysService: GatewaysService,
    ) { }

    async findAll(): Promise<SeoMetadata[]> {
        return await this.seoRepository.find({
            order: { page_route: 'ASC' },
        });
    }

    async findByRoute(page_route: string): Promise<SeoMetadata | null> {
        return await this.seoRepository.findOne({
            where: { page_route },
        });
    }

    async create(createSeoDto: CreateSeoDto): Promise<SeoMetadata> {
        const seo = this.seoRepository.create(createSeoDto);
        return await this.seoRepository.save(seo);
    }

    async update(id: number, updateSeoDto: UpdateSeoDto): Promise<SeoMetadata> {
        const seo = await this.seoRepository.findOne({ where: { id } });

        if (!seo) {
            throw new NotFoundException(`SEO metadata with ID ${id} not found`);
        }

        Object.assign(seo, updateSeoDto);
        return await this.seoRepository.save(seo);
    }

    async delete(id: number): Promise<void> {
        const result = await this.seoRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`SEO metadata with ID ${id} not found`);
        }
    }

    /**
     * Generate dynamic SEO metadata for comparison pages
     * @param comparisonSlug Format: "gateway1-slug-vs-gateway2-slug"
     * @returns SEO metadata object
     */
    async generateComparisonMetadata(comparisonSlug: string): Promise<Omit<SeoMetadata, 'id' | 'created_at' | 'updated_at'>> {
        // Parse the comparison slug
        const parts = comparisonSlug.split('-vs-');

        if (parts.length !== 2 || !parts[0] || !parts[1]) {
            throw new NotFoundException('Invalid comparison slug format. Expected: gateway1-slug-vs-gateway2-slug');
        }

        const [slug1, slug2] = parts;

        // Fetch both gateways to validate they exist
        const gateway1 = await this.gatewaysService.findBySlug(slug1);
        const gateway2 = await this.gatewaysService.findBySlug(slug2);

        // Generate SEO metadata
        const title = `${gateway1.name} vs ${gateway2.name} - Payment Gateway Comparison`;
        const description = `Compare ${gateway1.name} and ${gateway2.name} side-by-side. See transaction fees, supported countries, currencies, integration options, and more to choose the best payment gateway for your business.`;

        // Generate keywords from gateway names and features
        const keywords = [
            gateway1.name,
            gateway2.name,
            'payment gateway comparison',
            'transaction fees',
            'payment processing',
            gateway1.slug,
            gateway2.slug,
        ].join(', ');

        const ogTitle = `${gateway1.name} vs ${gateway2.name} Comparison`;
        const ogDescription = `Detailed comparison of ${gateway1.name} and ${gateway2.name}. Compare fees, features, and integration options.`;

        return {
            page_route: `/compare/${comparisonSlug}`,
            title,
            description,
            keywords,
            og_title: ogTitle,
            og_description: ogDescription,
            og_image: null as any, // Could be enhanced with dynamic image generation
        };
    }
}
