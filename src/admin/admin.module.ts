import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminGuard } from './admin.guard';
import { PaymentGateway } from '../database/entities/payment-gateway.entity';
import { Sponsor } from '../database/entities/sponsor.entity';
import { AdminUser } from '../database/entities/admin-user.entity';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { CsrfGuard } from './csrf.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentGateway, Sponsor, AdminUser]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret =
          configService.get<string>('jwt.accessSecret') ||
          configService.get<string>('jwt.secret') ||
          process.env.JWT_ACCESS_SECRET ||
          process.env.JWT_SECRET ||
          'your-secret-key';
        const expiresIn =
          (configService.get<StringValue>('jwt.accessExpiresIn') ||
            configService.get<StringValue>('jwt.expiresIn') ||
            (process.env.JWT_ACCESS_EXPIRES_IN as StringValue | undefined) ||
            (process.env.JWT_EXPIRES_IN as StringValue | undefined) ||
            '15m') as StringValue;

        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AdminController, AdminAuthController],
  providers: [AdminService, AdminAuthService, AdminGuard, CsrfGuard, Reflector],
  exports: [AdminService, AdminGuard, JwtModule],
})
export class AdminModule { }
