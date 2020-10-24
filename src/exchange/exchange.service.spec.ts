import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CurrenciesService } from '../currencies/currencies.service';
import { ExchangeService } from './exchange.service';

import { ExchangeInputType } from './types/exchange-input.type';

describe('ExchangeService', () => {
    let service: ExchangeService;
    let currenciesService: CurrenciesService;
    let mockData: ExchangeInputType;

    beforeEach(async () => {
        const currenciesServiceMock = {
            getCurrency: jest.fn().mockReturnValue({ value: 1 }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExchangeService,
                {
                    provide: CurrenciesService,
                    useFactory: () => currenciesServiceMock,
                },
            ],
        }).compile();

        service = module.get<ExchangeService>(ExchangeService);
        currenciesService = module.get<CurrenciesService>(CurrenciesService);
        mockData = { from: 'USD', to: 'BRL', amount: 1 } as ExchangeInputType;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('convertAmount()', () => {
        it('should throw if called with invalid params', async () => {
            mockData.from = '';
            await expect(service.convertAmount(mockData)).rejects.toThrow(
                new BadRequestException(),
            );

            mockData.from = 'USD';
            mockData.amount = 0;
            await expect(service.convertAmount(mockData)).rejects.toThrow(
                new BadRequestException(),
            );

            mockData.from = 'USD';
            mockData.to = 'USD';
            mockData.amount = 0;
            await expect(service.convertAmount(mockData)).rejects.toThrow(
                new BadRequestException(),
            );
        });

        it('should not throw if called with valid params', async () => {
            await expect(service.convertAmount(mockData)).resolves.not.toThrow();
        });

        it('should call getCurrency twice', async () => {
            await service.convertAmount(mockData);
            expect(currenciesService.getCurrency).toBeCalledTimes(2);
        });

        it('should call getCurrency with correct param', async () => {
            await service.convertAmount(mockData);
            expect(currenciesService.getCurrency).toBeCalledWith('USD');
            expect(currenciesService.getCurrency).toHaveBeenLastCalledWith('BRL');
        });

        it('should throw when getCurrency throw', async () => {
            (currenciesService.getCurrency as jest.Mock).mockRejectedValue(new Error());
            mockData.from = 'INVALID';
            await expect(service.convertAmount(mockData)).rejects.toThrow();
        });

        it('should return correct converted value', async () => {
            (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 1 });
            mockData.from = 'USD';
            mockData.to = 'USD';
            expect(await service.convertAmount(mockData)).toEqual({
                amount: 1,
            });

            (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 1 });
            (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 0.2 });
            mockData.from = 'USD';
            mockData.to = 'BRL';
            expect(await service.convertAmount(mockData)).toEqual({
                amount: 5,
            });

            (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 0.2 });
            (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 1 });
            mockData.from = 'BRL';
            mockData.to = 'BRL';
            expect(await service.convertAmount(mockData)).toEqual({
                amount: 0.2,
            });
        });
    });
});
