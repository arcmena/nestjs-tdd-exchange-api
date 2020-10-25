import { Controller, Get, Param } from '@nestjs/common';

// Service
import { CurrenciesService } from './currencies.service';

// Entity
import { Currency } from './currency.entity';

@Controller('currencies')
export class CurrenciesController {
    constructor(private currenciesService: CurrenciesService) {}

    @Get('/:currency')
    async getCurrency(@Param('currency') currency: string): Promise<Currency> {
        return await this.currenciesService.getCurrency(currency);
    }
}
