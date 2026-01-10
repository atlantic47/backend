import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SponsorsService } from './sponsors.service';
import { SponsorsController } from './sponsors.controller';
import { Sponsor } from '../database/entities/sponsor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Sponsor])],
    controllers: [SponsorsController],
    providers: [SponsorsService],
})
export class SponsorsModule { }
