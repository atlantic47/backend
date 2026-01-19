import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsGateway } from './analytics.gateway';
import { Visitor } from '../database/entities/visitor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Visitor])],
    controllers: [AnalyticsController],
    providers: [AnalyticsService, AnalyticsGateway],
    exports: [AnalyticsService],
})
export class AnalyticsModule { }
