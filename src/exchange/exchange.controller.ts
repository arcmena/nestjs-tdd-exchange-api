import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';

// Service
import { ExchangeService } from './exchange.service';

// Dto
import { ConvertAmountDto } from './dto/convert-amount.dto';

@Controller('exchange')
export class ExchangeController {
    constructor(private exchangeService: ExchangeService) {}

    @Get()
    @UsePipes(ValidationPipe)
    async convertAmount(@Query() converAmountDto: ConvertAmountDto): Promise<any> {
        return await this.exchangeService.convertAmount(converAmountDto);
    }
}
