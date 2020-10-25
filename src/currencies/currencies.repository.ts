import { BadRequestException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

// Entity
import { Currency } from './currency.entity';

// Types
import { CurrenciesInputType } from './types/currencies-input.type';

@EntityRepository(Currency)
export class CurrenciesRepository extends Repository<Currency> {
    async getCurrency(currency: string): Promise<Currency> {
        const result = await this.findOne({ currency });

        if (!result) throw new BadRequestException(`Currency not found with the name: ${currency}`);

        return result;
    }

    async createCurrency(newCurrency: CurrenciesInputType): Promise<Currency> {
        const createdCurrency = this.create({
            currency: newCurrency.currency,
            value: newCurrency.value,
        });

        await this.save(createdCurrency);

        return createdCurrency;
    }

    async updateCurrency({ currency, value }: CurrenciesInputType): Promise<Currency> {
        return new Currency();
    }

    async deleteCurrency(currency: string): Promise<void> {
        return;
    }
}
