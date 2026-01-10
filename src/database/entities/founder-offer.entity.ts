import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { PaymentGateway } from './payment-gateway.entity';

@Entity('founder_offers')
export class FounderOffer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    gateway_id: number;

    @ManyToOne(() => PaymentGateway, (gateway) => gateway.offers, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'gateway_id' })
    gateway: PaymentGateway;

    @Column({ length: 255 })
    title: string;

    @Column('text')
    description: string;

    @Column('simple-array', { nullable: true })
    countries: string[]; // Applicable countries (empty = all countries)

    @Column('simple-array', { nullable: true })
    currencies: string[]; // Applicable currencies

    @Column('simple-array', { nullable: true })
    crypto: string[]; // Applicable crypto

    @Column({ length: 255, nullable: true })
    discount: string; // e.g., "50% off for 6 months"

    @Column({ type: 'datetime', nullable: true })
    expires_at: Date;

    @CreateDateColumn()
    created_at: Date;
}
