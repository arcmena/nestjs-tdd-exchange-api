import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
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
        const createdCurrency = new Currency();
        createdCurrency.currency = newCurrency.currency;
        createdCurrency.value = newCurrency.value;

        try {
            await validateOrReject(createdCurrency);
            await this.save(createdCurrency);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return createdCurrency;
    }

    async updateCurrency({ currency, value }: CurrenciesInputType): Promise<Currency> {
        return new Currency();
    }

    async deleteCurrency(currency: string): Promise<void> {
        return;
    }
}
