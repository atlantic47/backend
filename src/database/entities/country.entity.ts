import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
} from 'typeorm';

@Entity('countries')
export class Country {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ unique: true, length: 2 })
    code: string; // ISO 2-letter country code (e.g., 'NG', 'US')

    @Column({ unique: true, length: 255 })
    slug: string;

    @Column('simple-array', { nullable: true })
    local_currencies: string[]; // e.g., ['NGN', 'USD']

    @Column('simple-array', { nullable: true })
    popular_crypto: string[]; // e.g., ['BTC', 'ETH', 'USDT']

    @Column({ nullable: true, length: 10 })
    flag_emoji: string; // e.g., '🇳🇬'
}
