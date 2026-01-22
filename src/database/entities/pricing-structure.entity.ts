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
    @Column({ type: 'varchar', length: 32, default: 'flat_rate' })
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

    @UpdateDateColumn({ type: 'datetime' })
    last_updated: Date;

    @CreateDateColumn({ type: 'datetime' })
    created_at: Date;
}
