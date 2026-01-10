import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { FounderOffer } from '../database/entities/founder-offer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FounderOffer])],
    controllers: [OffersController],
    providers: [OffersService],
})
export class OffersModule { }
