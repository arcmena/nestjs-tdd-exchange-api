import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Length } from 'class-validator';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('currency')
export class Currency {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @PrimaryColumn()
    @Length(3, 3)
    @IsNotEmpty()
    currency: string;

    @Column()
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    value: number;

    @Column('date')
    created_at: Date;
}
