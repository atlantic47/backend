import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { PaymentGateway } from './payment-gateway.entity';

@Entity('sponsors')
@Index(['display_order'])
export class Sponsor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    gateway_id: number;

    @ManyToOne(() => PaymentGateway, (gateway) => gateway.sponsors, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'gateway_id' })
    gateway: PaymentGateway;

    @Column({ default: false })
    is_featured: boolean;

    @Column({ type: 'int', default: 0 })
    display_order: number; // Lower number = higher priority

    @Column({ default: false })
    recommended_badge: boolean; // "Recommended this month"

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    monthly_price: number; // e.g., 99.00

    @Column({ type: 'datetime', nullable: true })
    expires_at: Date;

    // Expiration tracking for monthly advertisements
    @Column({ type: 'datetime', nullable: true })
    start_date: Date;

    @Column({ type: 'datetime', nullable: true })
    end_date: Date;

    @Column({ type: 'varchar', length: 20, default: 'active' })
    status: string; // 'active', 'expired', 'pending'

    // New enhanced fields for sponsor cards
    @Column({ type: 'int', nullable: true, default: null })
    vibe_score: number; // 1-10 rating for developer experience (docs clarity + API speed)

    @Column({ type: 'varchar', length: 255, nullable: true })
    primary_corridor: string; // e.g., "EU → West Africa", "US → LATAM"

    @Column({ default: false })
    verified_2026: boolean; // Premium "Verified 2026" badge for top 20 vetted providers

    @Column({ default: 'pending' })
    approval_status: string; // 'pending', 'approved', 'rejected'

    @Column({ type: 'timestamp', nullable: true })
    submitted_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    reviewed_at: Date;

    @Column({ nullable: true })
    reviewed_by: string; // Admin identifier
}
