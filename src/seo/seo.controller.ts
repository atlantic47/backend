import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, SetMetadata } from '@nestjs/common';
import { SeoService } from './seo.service';
import type { CreateSeoDto, UpdateSeoDto } from './seo.service';
import { AdminGuard } from '../admin/admin.guard';

export const Public = () => SetMetadata('isPublic', true);

@Controller('seo')
export class SeoController {
    constructor(private readonly seoService: SeoService) { }

    // Public endpoint - anyone can fetch SEO metadata
    @Get()
    @Public()
    async findAll() {
        return await this.seoService.findAll();
    }

    // Public endpoint - fetch by route
    @Get(':route')
    @Public()
    async findByRoute(@Param('route') route: string) {
        const seoData = await this.seoService.findByRoute(route);
        if (!seoData) {
            return null; // Return null instead of undefined for proper JSON serialization
        }
        return seoData;
    }

    // Admin-only endpoints
    @Post()
    @UseGuards(AdminGuard)
    async create(@Body() createSeoDto: CreateSeoDto) {
        return await this.seoService.create(createSeoDto);
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    async update(@Param('id') id: string, @Body() updateSeoDto: UpdateSeoDto) {
        return await this.seoService.update(+id, updateSeoDto);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    async delete(@Param('id') id: string) {
        await this.seoService.delete(+id);
        return { message: 'SEO metadata deleted successfully' };
    }
}
