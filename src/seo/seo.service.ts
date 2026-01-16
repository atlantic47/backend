import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeoMetadata } from '../database/entities/seo-metadata.entity';

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
}
