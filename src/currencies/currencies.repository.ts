import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { EntityRepository, Repository } from 'typeorm';

// Entity
import { Currency } from './currency.entity';

// Types
import { CreateCurrencyDto } from './dto/create-currency.dto';

@EntityRepository(Currency)
export class CurrenciesRepository extends Repository<Currency> {
    async getCurrency(currency: string): Promise<Currency> {
        const result = await this.findOne({ currency });

        if (!result) throw new NotFoundException(`Currency not found with the name: ${currency}`);

        return result;
    }

    async createCurrency(newCurrency: CreateCurrencyDto): Promise<Currency> {
        // TODO: Refactor to this.create
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

    async updateCurrency({ currency, value }: CreateCurrencyDto): Promise<Currency> {
        const result = await this.findOne({ currency });

        if (!result) throw new NotFoundException(`Currency not found with the name: ${currency}`);

        try {
            result.value = value;
            await this.save(result);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return result;
    }

    async deleteCurrency(currency: string): Promise<void> {
        try {
            const deleted = await this.delete({ currency });

            if (deleted.affected === 0)
                throw new NotFoundException(`Currency not found with the name: ${currency}`);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return;
    }
}
