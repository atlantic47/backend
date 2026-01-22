import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentGateway } from './entities/payment-gateway.entity';
import { Sponsor } from './entities/sponsor.entity';
import { FounderOffer } from './entities/founder-offer.entity';
import { Country } from './entities/country.entity';
import { Currency } from './entities/currency.entity';
import { Consultation } from './entities/consultation.entity';
import { ConsultationRecommendation } from './entities/consultation-recommendation.entity';
import { SeoMetadata } from './entities/seo-metadata.entity';
import { PricingStructure } from './entities/pricing-structure.entity';
import { Visitor } from './entities/visitor.entity';
import { AdminUser } from './entities/admin-user.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
                const dbType = configService.get<string>('database.type') || 'mysql';
                const baseOptions = {
                    entities: [
                        PaymentGateway,
                        Sponsor,
                        FounderOffer,
                        Country,
                        Currency,
                        Consultation,
                        ConsultationRecommendation,
                        SeoMetadata,
                        PricingStructure,
                        Visitor,
                        AdminUser,
                    ],
                    synchronize: true, // Set to false in production, use migrations
                    logging: process.env.NODE_ENV === 'development',
                };

                if (dbType === 'sqlite') {
                    return {
                        type: 'sqlite',
                        database: configService.get('database.sqlitePath') || 'data/paygate.sqlite',
                        ...baseOptions,
                    };
                }

                return {
                    type: 'mysql',
                    host: configService.get('database.host'),
                    port: configService.get('database.port'),
                    username: configService.get('database.username'),
                    password: configService.get('database.password'),
                    database: configService.get('database.database'),
                    ...baseOptions,
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule { }
