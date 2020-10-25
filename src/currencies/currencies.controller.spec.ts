import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

// Controller
import { CurrenciesController } from './currencies.controller';

// Service
import { CurrenciesService } from './currencies.service';
import { Currency } from './currency.entity';

describe('CurrenciesController', () => {
    let controller: CurrenciesController;
    let service: CurrenciesService;
    let mockData: Currency;

    beforeEach(async () => {
        const currenciesServiceMock = {
            getCurrency: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [CurrenciesController],
            providers: [{ provide: CurrenciesService, useFactory: () => currenciesServiceMock }],
        }).compile();

        controller = module.get<CurrenciesController>(CurrenciesController);
        service = module.get<CurrenciesService>(CurrenciesService);
        mockData = { id: 1, currency: 'USD', value: 1, created_at: new Date() } as Currency;
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getCurrency()', () => {
        it('should throw when service throw', async () => {
            (service.getCurrency as jest.Mock).mockRejectedValue(new BadRequestException());
            await expect(controller.getCurrency('INVALID')).rejects.toThrow(
                new BadRequestException(),
            );
        });

        it('should be called service with correct params', async () => {
            await controller.getCurrency('USD');
            expect(service.getCurrency).toBeCalledWith('USD');
        });

        it('should return when service return', async () => {
            (service.getCurrency as jest.Mock).mockReturnValue(mockData);
            expect(await controller.getCurrency('USD')).toEqual(mockData);
        });
    });
});
