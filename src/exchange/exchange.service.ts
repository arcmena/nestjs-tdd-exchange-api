import { BadRequestException, Injectable } from '@nestjs/common';

// Services
import { CurrenciesService } from '../currencies/currencies.service';

// Types
import { ExchangeType } from './types/exchange.type';

// Dto
import { ConvertAmountDto } from './dto/convert-amount.dto';

@Injectable()
export class ExchangeService {
    constructor(private currenciesService: CurrenciesService) {}

    async convertAmount({ from, to, amount }: ConvertAmountDto): Promise<ExchangeType> {
        if (!from || !to || !amount) throw new BadRequestException();

        try {
            const currencyFrom = await this.currenciesService.getCurrency(from);
            const currencyTo = await this.currenciesService.getCurrency(to);

            return {
                amount: ((currencyFrom.value / currencyTo.value) * amount).toFixed(2),
            };
        } catch (error) {
            throw new Error(error);
        }
    }
}
