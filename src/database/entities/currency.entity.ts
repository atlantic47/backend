import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('currencies')
export class Currency {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 3 })
    code: string; // e.g., 'USD'

    @Column({ length: 255 })
    name: string; // e.g., 'United States dollar'

    @Column({ length: 50, nullable: true })
    symbol: string; // e.g., '$'
}
