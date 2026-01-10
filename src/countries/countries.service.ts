import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../database/entities/country.entity';

@Injectable()
export class CountriesService {
    constructor(
        @InjectRepository(Country)
        private countryRepository: Repository<Country>,
    ) { }

    async findAll() {
        return await this.countryRepository.find({
            order: { name: 'ASC' },
        });
    }

    async findBySlug(slug: string) {
        return await this.countryRepository.findOne({
            where: { slug },
        });
    }

    async create(createCountryDto: any) {
        const country = this.countryRepository.create(createCountryDto);
        return await this.countryRepository.save(country);
    }
}
