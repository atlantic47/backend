import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminGuard } from './admin.guard';
import { PaymentGateway } from '../database/entities/payment-gateway.entity';
import { Sponsor } from '../database/entities/sponsor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentGateway, Sponsor])],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard, Reflector],
  exports: [AdminService],
})
export class AdminModule { }
