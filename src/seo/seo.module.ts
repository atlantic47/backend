import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeoService } from './seo.service';
import { SeoController } from './seo.controller';
import { SeoMetadata } from '../database/entities/seo-metadata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SeoMetadata])],
  providers: [SeoService],
  controllers: [SeoController],
  exports: [SeoService],
})
export class SeoModule { }
