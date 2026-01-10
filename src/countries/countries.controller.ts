import {
    Controller,
    Get,
    Param,
    UseInterceptors,
    Post,
    Body,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
    constructor(private readonly countriesService: CountriesService) { }

    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(3600) // Cache for 1 hour (reference data changes rarely)
    findAll() {
        return this.countriesService.findAll();
    }

    @Get(':slug')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(3600)
    findBySlug(@Param('slug') slug: string) {
        return this.countriesService.findBySlug(slug);
    }

    @Post()
    create(@Body() createCountryDto: any) {
        return this.countriesService.create(createCountryDto);
    }
}
