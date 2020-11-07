import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { ExchangeModule } from './exchange/exchange.module';
import { CurrenciesModule } from './currencies/currencies.module';

// DB Configuration
import { configService } from './database/database.service';

@Module({
    imports: [
        TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
        ExchangeModule,
        CurrenciesModule,
    ],
})
export class AppModule {}
