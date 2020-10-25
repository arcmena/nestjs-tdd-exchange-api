import { Injectable, BadRequestException } from '@nestjs/common';

// Repository
import { CurrenciesRepository } from './currencies.repository';

// Entity
import { Currency } from './currency.entity';
import { CreateCurrencyDto } from './dto/create-currency.dto';

@Injectable()
export class CurrenciesService {
    constructor(private currenciesRepository: CurrenciesRepository) {}

    async getCurrency(currency: string): Promise<Currency> {
        return await this.currenciesRepository.getCurrency(currency);
    }

    async createCurrency(createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
        if (createCurrencyDto.value <= 0)
            throw new BadRequestException('The value must be greater than zero.');
        return await this.currenciesRepository.createCurrency(createCurrencyDto);
    }

    async updateCurrency({ currency, value }: CreateCurrencyDto): Promise<Currency> {
        if (value <= 0) {
            throw new BadRequestException('The value must be greater than zero.');
        } else if (!currency) {
            throw new BadRequestException('The currency name must be stated.');
        }
        return await this.currenciesRepository.updateCurrency({ currency, value });
    }

    async deleteCurrency(currency: string): Promise<void> {
        return await this.currenciesRepository.deleteCurrency(currency);
    }
}
