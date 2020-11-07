import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

// Controller
import { CurrenciesController } from './currencies.controller';

// Service
import { CurrenciesService } from './currencies.service';

// Entity
import { Currency } from './currency.entity';

describe('CurrenciesController', () => {
    let controller: CurrenciesController;
    let service: CurrenciesService;
    let fullCurrency: Currency;
    let newCurrency: Currency;

    beforeEach(async () => {
        const currenciesServiceMock = {
            getCurrency: jest.fn(),
            createCurrency: jest.fn(),
            deleteCurrency: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [CurrenciesController],
            providers: [{ provide: CurrenciesService, useFactory: () => currenciesServiceMock }],
        }).compile();

        controller = module.get<CurrenciesController>(CurrenciesController);
        service = module.get<CurrenciesService>(CurrenciesService);
        fullCurrency = { id: 1, currency: 'USD', value: 1, created_at: new Date() } as Currency;
        newCurrency = { currency: 'USD', value: 1 } as Currency;
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

        it('should call service with correct params', async () => {
            await controller.getCurrency('USD');
            expect(service.getCurrency).toBeCalledWith('USD');
        });

        it('should return when service return', async () => {
            (service.getCurrency as jest.Mock).mockReturnValue(fullCurrency);
            expect(await controller.getCurrency('USD')).toEqual(fullCurrency);
        });
    });

    describe('createCurrency()', () => {
        it('should throw when service throw', async () => {
            (service.createCurrency as jest.Mock).mockRejectedValue(new BadRequestException());
            await expect(controller.createCurrency(newCurrency)).rejects.toThrow(
                new BadRequestException(),
            );
        });

        it('should be called service with correct params', async () => {
            await controller.createCurrency(newCurrency);
            expect(service.createCurrency).toBeCalledWith(newCurrency);
        });

        it('should return when service return', async () => {
            (service.createCurrency as jest.Mock).mockReturnValue(fullCurrency);
            expect(await controller.createCurrency(fullCurrency)).toEqual(fullCurrency);
        });
    });

    describe('deleteCurrency()', () => {
        it('should throw when service throw', async () => {
            (service.deleteCurrency as jest.Mock).mockRejectedValue(new BadRequestException());
            await expect(controller.deleteCurrency('INVALID')).rejects.toThrow(
                new BadRequestException(),
            );
        });

        it('should be called service with correct params', async () => {
            await controller.deleteCurrency('USD');
            expect(service.deleteCurrency).toBeCalledWith('USD');
        });
    });
});
