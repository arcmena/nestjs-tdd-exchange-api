import { IsNotEmpty, Length } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('currency')
export class Currency {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ unique: true })
    @Length(3, 3)
    @IsNotEmpty()
    currency: string;

    @Column()
    @IsNotEmpty()
    value: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
