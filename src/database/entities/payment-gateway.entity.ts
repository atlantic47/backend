import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Sponsor } from './sponsor.entity';
import { FounderOffer } from './founder-offer.entity';
import { Country } from './country.entity';
import { Currency } from './currency.entity';
import { PricingStructure } from './pricing-structure.entity';

@Entity('payment_gateways')
@Index(['status_slot'])
export class PaymentGateway {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ unique: true, length: 255 })
    slug: string;

    @Column('text')
    description: string;

    @Column({ nullable: true, length: 500 })
    logo_url: string;

    @Column({ nullable: true, length: 500 })
    website_url: string;

    @ManyToMany(() => Country, { cascade: true })
    @JoinTable({
        name: 'payment_gateways_countries',
        joinColumn: { name: 'gateway_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'country_id', referencedColumnName: 'id' },
    })
    countries: Country[];

    @ManyToMany(() => Currency, { cascade: true })
    @JoinTable({
        name: 'payment_gateways_currencies',
        joinColumn: { name: 'gateway_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'currency_id', referencedColumnName: 'id' },
    })
    currencies: Currency[];

    @Column('simple-array', { nullable: true })
    crypto_supported: string[];

    // e.g., 'API', 'Plugin', 'Hosted', 'Mobile SDK'
    @Column('simple-array')
    integration_type: string[];

    // Business model classification: 'Aggregator', 'Gateway', 'Processor' or combination
    @Column('simple-array', { nullable: true })
    business_type: string[];

    // Local payment methods supported (e.g. M-Pesa, Boleto, etc.)
    @Column('simple-array', { nullable: true })
    local_payments_supported: string[];

    // Numeric fee fields for filtering and sorting
    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    local_fee_percentage: number;  // e.g., 2.90 for 2.9%

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    local_fee_fixed: number;       // e.g., 0.30 for $0.30

    @Column({ length: 3, nullable: true })
    local_fee_currency: string;    // e.g., "USD"

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    international_fee_percentage: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    international_fee_fixed: number;

    @Column({ length: 3, nullable: true })
    international_fee_currency: string;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    setup_fee: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    monthly_fee: number;

    @Column({ length: 3, nullable: true, default: 'USD' })
    fee_currency: string;  // Default currency for setup/monthly

    @Column('int', { nullable: true })
    settlement_hours: number;  // Convert T+1 to 24, T+7 to 168, etc.

    // JSON object for flexible fee structure (legacy/display)
    @Column('json', { nullable: true })
    fees: {
        transaction_fee?: string;
        setup_fee?: string;
        monthly_fee?: string;
        notes?: string;
    };

    // Payment methods available per country
    @Column('json', { nullable: true })
    payment_methods: {
        [countryCode: string]: string[]; // e.g., { "KE": ["M-Pesa", "Cards"], "NG": ["Cards", "USSD"] }
    };

    @Column({ length: 100, nullable: true })
    settlement_speed: string; // e.g., 'T+1', 'Instant', 'T+7'

    @Column('text', { nullable: true })
    startup_offer: string | null;

    @Column({ default: 'active' })
    status_slot: string; // 'active', 'inactive', 'featured'

    @Column({ type: 'int', default: 0 })
    fit_score: number; // Calculated field for ranking

    @Column({ default: 'pending' })
    approval_status: string; // 'pending', 'approved', 'rejected'

    @Column({ type: 'datetime', nullable: true })
    submitted_at: Date;

    @Column({ type: 'datetime', nullable: true })
    reviewed_at: Date;

    @Column({ nullable: true })
    reviewed_by: string; // Admin identifier

    @OneToMany(() => Sponsor, (sponsor) => sponsor.gateway)
    sponsors: Sponsor[];

    @OneToMany(() => FounderOffer, (offer) => offer.gateway)
    offers: FounderOffer[];

    @OneToMany(() => PricingStructure, (pricing) => pricing.gateway)
    pricing_structures: PricingStructure[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
