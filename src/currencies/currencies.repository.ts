import { BadRequestException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

// Entities
import { Currencies } from './currencies.entity';
import { CurrenciesInputType } from './types/currencies-input.type';

@EntityRepository(Currencies)
export class CurrenciesRepository extends Repository<Currencies> {
    async getCurrency(currency: string): Promise<Currencies> {
        const result = await this.findOne({ currency });

        if (!result) throw new BadRequestException(`Currency not found with the name: ${currency}`);

        return result;
    }

    async createCurrency({ currency, value }: CurrenciesInputType): Promise<Currencies> {
        return new Currencies();
    }

    async updateCurrency({ currency, value }: CurrenciesInputType): Promise<Currencies> {
        return new Currencies();
    }

    async deleteCurrency(currency: string): Promise<void> {
        return;
    }
}
