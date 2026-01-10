import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatewaysService } from './gateways.service';
import { GatewaysController } from './gateways.controller';
import { PaymentGateway } from '../database/entities/payment-gateway.entity';
import { Country } from '../database/entities/country.entity';
import { Currency } from '../database/entities/currency.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PaymentGateway, Country, Currency])],
    controllers: [GatewaysController],
    providers: [GatewaysService],
    exports: [GatewaysService],
})
export class GatewaysModule { }
