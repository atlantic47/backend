import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { GatewaysModule } from './gateways/gateways.module';
import { SponsorsModule } from './sponsors/sponsors.module';
import { OffersModule } from './offers/offers.module';
import { CountriesModule } from './countries/countries.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 300, // Default 5 minutes
      max: 100, // Max items in cache
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 seconds
      limit: 100, // 100 requests per TTL
    }]),
    DatabaseModule,
    GatewaysModule,
    SponsorsModule,
    OffersModule,
    CountriesModule,
    ConsultationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
