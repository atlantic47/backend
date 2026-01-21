import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('admin_users')
@Index(['username'], { unique: true })
@Index(['email'], { unique: true })
export class AdminUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    full_name: string;

    @Column({ length: 100 })
    username: string;

    @Column({ length: 255 })
    email: string;

    @Column({ length: 255 })
    password_hash: string;

    @Column({ default: 'admin' })
    role: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ type: 'datetime', nullable: true })
    last_login_at: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    refresh_token_hash: string | null;

    @Column({ type: 'datetime', nullable: true })
    refresh_token_expires_at: Date | null;

    @CreateDateColumn({ type: 'datetime' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updated_at: Date;
}
