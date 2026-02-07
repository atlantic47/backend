import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatewaysService } from './gateways.service';
import { GatewaysController } from './gateways.controller';
import { PaymentGateway } from '../database/entities/payment-gateway.entity';
import { Country } from '../database/entities/country.entity';
import { Currency } from '../database/entities/currency.entity';
import { PricingStructure } from '../database/entities/pricing-structure.entity';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { AdminModule } from '../admin/admin.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentGateway, Country, Currency, PricingStructure]),
        AdminModule, // Required for AdminGuard
    ],
    controllers: [GatewaysController, PricingController],
    providers: [GatewaysService, PricingService],
    exports: [GatewaysService],
})
export class GatewaysModule { }
