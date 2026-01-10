import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
    constructor(private readonly offersService: OffersService) { }

    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(300) // Cache for 5 minutes
    findAll(
        @Query('country') country?: string,
        @Query('currency') currency?: string,
        @Query('crypto') crypto?: string,
    ) {
        return this.offersService.findAll(country, currency, crypto);
    }

    @Post()
    create(@Body() createOfferDto: any) {
        return this.offersService.create(createOfferDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateOfferDto: any) {
        return this.offersService.update(+id, updateOfferDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.offersService.remove(+id);
    }
}
