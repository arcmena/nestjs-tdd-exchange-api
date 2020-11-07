import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';

// Service
import { CurrenciesService } from './currencies.service';

// Entity
import { Currency } from './currency.entity';

// Dto
import { CreateCurrencyDto } from './dto/create-currency.dto';

@Controller('currencies')
export class CurrenciesController {
    constructor(private currenciesService: CurrenciesService) {}

    @Get('/:currency')
    async getCurrency(@Param('currency') currency: string): Promise<Currency> {
        return await this.currenciesService.getCurrency(currency);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createCurrency(@Body() createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
        return await this.currenciesService.createCurrency(createCurrencyDto);
    }

    @Delete('/:currency')
    async deleteCurrency(@Param('currency') currency: string): Promise<void> {
        return await this.currenciesService.deleteCurrency(currency);
    }

    @Patch('/:currency/value')
    async updateCurrency(@Param('currency') currency: string, @Body('value') value: number) {
        return await this.currenciesService.updateCurrency({ currency, value });
    }
}
