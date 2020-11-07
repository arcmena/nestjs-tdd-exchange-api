import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './currency.entity';
import { CurrenciesRepository } from './currencies.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Currency, CurrenciesRepository])],
    providers: [CurrenciesService],
    controllers: [CurrenciesController],
    exports: [CurrenciesService],
})
export class CurrenciesModule {}
