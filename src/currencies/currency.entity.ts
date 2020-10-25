import { IsNotEmpty, Length } from 'class-validator';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('currency')
export class Currency {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @PrimaryColumn()
    @Length(3, 3)
    @IsNotEmpty()
    currency: string;

    @Column()
    @IsNotEmpty()
    value: number;

    @Column('date')
    created_at: Date;
}
