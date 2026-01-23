import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { Consultation } from '../database/entities/consultation.entity';
import { ConsultationRecommendation } from '../database/entities/consultation-recommendation.entity';
import { PaymentGateway } from '../database/entities/payment-gateway.entity';
import { AdminModule } from '../admin/admin.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Consultation, ConsultationRecommendation, PaymentGateway]),
        AdminModule,
    ],
    controllers: [ConsultationsController],
    providers: [ConsultationsService],
    exports: [ConsultationsService],
})
export class ConsultationsModule { }
