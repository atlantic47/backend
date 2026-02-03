import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeoService } from './seo.service';
import { SeoController } from './seo.controller';
import { SeoMetadata } from '../database/entities/seo-metadata.entity';
import { AdminModule } from '../admin/admin.module';
import { GatewaysModule } from '../gateways/gateways.module';

@Module({
  imports: [TypeOrmModule.forFeature([SeoMetadata]), AdminModule, GatewaysModule],
  providers: [SeoService],
  controllers: [SeoController],
  exports: [SeoService],
})
export class SeoModule { }
