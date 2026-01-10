import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { SponsorsService } from './sponsors.service';

@Controller('sponsors')
export class SponsorsController {
    constructor(private readonly sponsorsService: SponsorsService) { }

    @Get('featured')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(600) // Cache for 10 minutes
    getFeaturedSponsors() {
        return this.sponsorsService.getFeaturedSponsors();
    }

    @Post()
    create(@Body() createSponsorDto: any) {
        return this.sponsorsService.create(createSponsorDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSponsorDto: any) {
        return this.sponsorsService.update(+id, updateSponsorDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.sponsorsService.remove(+id);
    }
}
