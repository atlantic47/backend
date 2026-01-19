import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('analytics_visitors')
export class Visitor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    session_id: string;

    @Column({ length: 2 })
    @Index()
    country_code: string;

    @Column({ length: 100 })
    country_name: string;

    @Column({ length: 64 })
    ip_hash: string;

    @CreateDateColumn()
    first_seen: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @Index()
    last_seen: Date;

    @Column({ default: 1 })
    page_views: number;

    @Column({ nullable: true })
    user_agent: string;

    @Column({ nullable: true })
    referrer: string;
}
