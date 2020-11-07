import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { ExchangeType } from './types/exchange.type';

describe('ExchangeController', () => {
    let controller: ExchangeController;
    let service: ExchangeService;
    let mockData;

    beforeEach(async () => {
        const exchangeServiceMock = {
            convertAmount: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExchangeController],
            providers: [{ provide: ExchangeService, useFactory: () => exchangeServiceMock }],
        }).compile();

        controller = module.get<ExchangeController>(ExchangeController);
        service = module.get<ExchangeService>(ExchangeService);
        mockData = { from: 'TMP', to: 'TMP', amount: 1 };
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('convertAmount()', () => {
        it('should throw when service throw', async () => {
            (service.convertAmount as jest.Mock).mockRejectedValue(new BadRequestException());
            mockData.from = 'INVALID';
            mockData.to = 'INVALID';
            await expect(controller.convertAmount(mockData)).rejects.toThrow(
                new BadRequestException(),
            );
        });

        it('should call service with correct params', async () => {
            await controller.convertAmount(mockData);
            expect(service.convertAmount).toBeCalledWith(mockData);
        });

        it('should call service with correct params', async () => {
            const mockReturn = { amount: '1' } as ExchangeType;

            mockData.from = 'USD';
            mockData.to = 'BRL';

            (service.convertAmount as jest.Mock).mockReturnValue(mockReturn);
            expect(await controller.convertAmount(mockData)).toEqual(mockReturn);
        });
    });
});
