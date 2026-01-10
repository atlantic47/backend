import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Consultation } from './consultation.entity';
import { PaymentGateway } from './payment-gateway.entity';

@Entity('consultation_recommendations')
export class ConsultationRecommendation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Consultation, (consultation) => consultation.recommendations)
    @JoinColumn({ name: 'consultation_id' })
    consultation: Consultation;

    @ManyToOne(() => PaymentGateway)
    @JoinColumn({ name: 'gateway_id' })
    gateway: PaymentGateway;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    score: number;

    @Column({ type: 'json' })
    reasons: string[];

    @CreateDateColumn()
    created_at: Date;
}
