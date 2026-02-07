import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UseGuards,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { SponsorsService } from './sponsors.service';
import { AdminGuard } from '../admin/admin.guard';

@Controller('sponsors')
export class SponsorsController {
    constructor(private readonly sponsorsService: SponsorsService) { }

    /**
     * Get all active sponsors sorted by expiration (ending soonest first)
     */
    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(300) // Cache for 5 minutes
    getActiveSponsors() {
        return this.sponsorsService.getActiveSponsors();
    }

    /**
     * Get count of available advertisement slots with upcoming expirations
     */
    @Get('available-slots')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(60) // Cache for 1 minute
    async getAvailableSlots() {
        const slotsInfo = await this.sponsorsService.getAvailableSlotsWithExpirations();
        return slotsInfo;
    }

    /**
     * Get featured sponsors (legacy endpoint)
     */
    @Get('featured')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(300) // Cache for 5 minutes
    getFeaturedSponsors() {
        return this.sponsorsService.getFeaturedSponsors();
    }

    /**
     * Get sponsor by ID
     */
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.sponsorsService.findOne(+id);
    }

    /**
     * Create new sponsor advertisement
     */
    @Post()
    @UseGuards(AdminGuard) // Only admins can create sponsors
    create(@Body() createSponsorDto: any) {
        return this.sponsorsService.createSponsor(createSponsorDto);
    }

    @Patch(':id')
    @UseGuards(AdminGuard) // Only admins can update sponsors
    update(@Param('id') id: string, @Body() updateSponsorDto: any) {
        return this.sponsorsService.update(+id, updateSponsorDto);
    }

    @Delete(':id')
    @UseGuards(AdminGuard) // Only admins can delete sponsors
    remove(@Param('id') id: string) {
        return this.sponsorsService.remove(+id);
    }
}
