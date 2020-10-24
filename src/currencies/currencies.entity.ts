import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('currency')
export class Currencies {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @PrimaryColumn()
    currency: string;

    @Column()
    value: number;

    @Column('date')
    created_at: Date;
}