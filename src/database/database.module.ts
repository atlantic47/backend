import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentGateway } from './entities/payment-gateway.entity';
import { Sponsor } from './entities/sponsor.entity';
import { FounderOffer } from './entities/founder-offer.entity';
import { Country } from './entities/country.entity';
import { Currency } from './entities/currency.entity';
import { Consultation } from './entities/consultation.entity';
import { ConsultationRecommendation } from './entities/consultation-recommendation.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                database: configService.get('database.database'),
                entities: [PaymentGateway, Sponsor, FounderOffer, Country, Currency, Consultation, ConsultationRecommendation],
                synchronize: true, // Set to false in production, use migrations
                logging: process.env.NODE_ENV === 'development',
            }),
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule { }
