import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PricingService } from './pricing.service';
import type { CreatePricingDto, UpdatePricingDto } from './pricing.service';

export const Public = () => (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
        Reflect.defineMetadata('isPublic', true, descriptor.value);
    }
    return descriptor;
};

@Controller('gateways')
export class PricingController {
    constructor(private readonly pricingService: PricingService) { }

    // Public endpoint - get pricing for a gateway
    @Get(':id/pricing')
    @Public()
    async getPricing(@Param('id') id: string) {
        return await this.pricingService.findByGateway(+id);
    }

    // Admin-only endpoints
    @Post(':id/pricing')
    async createPricing(@Param('id') gatewayId: string, @Body() createPricingDto: CreatePricingDto) {
        return await this.pricingService.create({
            ...createPricingDto,
            gateway_id: +gatewayId
        });
    }

    @Put('pricing/:id')
    async updatePricing(@Param('id') id: string, @Body() updatePricingDto: UpdatePricingDto) {
        return await this.pricingService.update(+id, updatePricingDto);
    }

    @Delete('pricing/:id')
    async deletePricing(@Param('id') id: string) {
        await this.pricingService.delete(+id);
        return { message: 'Pricing deleted successfully' };
    }
}
