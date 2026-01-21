import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Sponsor } from '../database/entities/sponsor.entity';
import { PaymentGateway } from '../database/entities/payment-gateway.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Sponsor, PaymentGateway])],
    controllers: [PaymentsController],
    providers: [PaymentsService],
    exports: [PaymentsService],
})
export class PaymentsModule { }
