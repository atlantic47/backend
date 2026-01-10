import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { ConsultationRecommendation } from './consultation-recommendation.entity';

@Entity('consultations')
export class Consultation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Contact Info
    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    company_name: string;

    // Business Details
    @Column({ type: 'text', nullable: true })
    product_description: string;

    @Column({ type: 'simple-array', nullable: true })
    business_types: string[];

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    monthly_volume: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    avg_transaction_amount: number;

    @Column({ nullable: true })
    industry: string; // SaaS, Retail, Betting, Crypto

    @Column({ nullable: true })
    primary_region: string; // East Africa, EU, LATAM

    @Column({ nullable: true })
    monthly_volume_range: string; // <$10k, $10k–$100k, $1M+

    @Column({ nullable: true })
    technical_framework: string; // Shopify, WooCommerce, Custom API

    @Column({ type: 'simple-array', nullable: true })
    desired_payment_methods: string[]; // Mobile Money, Cards, Stablecoins/USDT

    @Column({ type: 'text', nullable: true })
    current_pain_point: string; // High fees, Account bans, Low success rates

    // Requirements
    @Column({ type: 'simple-array' })
    countries_needed: string[];

    @Column({ type: 'simple-array' })
    currencies_needed: string[];

    @Column({ type: 'simple-array' })
    integration_types_preferred: string[];

    @Column({ type: 'text', nullable: true })
    special_requirements: string;

    // Status
    @Column({ default: 'pending' })
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => ConsultationRecommendation, (rec) => rec.consultation)
    recommendations: ConsultationRecommendation[];
}
