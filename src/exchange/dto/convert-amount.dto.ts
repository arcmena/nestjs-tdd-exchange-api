import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class ConvertAmountDto {
    @IsNotEmpty()
    @Length(3, 3)
    from: string;

    @IsNotEmpty()
    @Length(3, 3)
    to: string;

    @IsNotEmpty()
    @IsNumberString()
    amount: number;
}
