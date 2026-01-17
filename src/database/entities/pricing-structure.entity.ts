import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PaymentGateway } from './payment-gateway.entity';

@Entity('pricing_structures')
export class PricingStructure {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PaymentGateway, gateway => gateway.pricing_structures)
    @JoinColumn({ name: 'gateway_id' })
    gateway: PaymentGateway;

    @Column()
    gateway_id: number;

    // Pricing Model
    @Column({
        type: 'enum',
        enum: ['flat_rate', 'interchange_plus', 'tiered', 'subscription', 'custom'],
        default: 'flat_rate'
    })
    pricing_model: string;

    // Local Transaction Fees
    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    local_transaction_fee_percentage: number; // e.g., 2.9

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    local_transaction_fee_fixed: number; // e.g., 0.30

    // International Transaction Fees
    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    international_transaction_fee_percentage: number; // e.g., 3.9

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    international_transaction_fee_fixed: number; // e.g., 0.50

    // Other Fees
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    monthly_fee: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    setup_fee: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    chargeback_fee: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    currency_conversion_fee: number;

    // Currency
    @Column({ default: 'USD' })
    currency: string;

    // Metadata
    @Column({ type: 'text', nullable: true })
    notes: string; // Special conditions, disclaimers

    @UpdateDateColumn({ type: 'timestamp' })
    last_updated: Date;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
