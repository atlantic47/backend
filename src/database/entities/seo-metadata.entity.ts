import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('seo_metadata')
export class SeoMetadata {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    page_route: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({ nullable: true })
    keywords: string;

    @Column({ nullable: true })
    og_image: string;

    @Column({ nullable: true })
    og_title: string;

    @Column({ type: 'text', nullable: true })
    og_description: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
