import { IsNotEmpty, Length } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('currency')
export class Currency {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ unique: true })
    @Length(3, 3)
    @IsNotEmpty()
    currency: string;

    @Column('decimal', { precision: 5, scale: 2 })
    @IsNotEmpty()
    value: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
