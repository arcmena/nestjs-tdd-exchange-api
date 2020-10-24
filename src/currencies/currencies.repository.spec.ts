import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

// Entity
import { Currencies } from './currencies.entity';

// Repository
import { CurrenciesRepository } from './currencies.repository';

describe('CurrenciesRepository', () => {
    let repository: CurrenciesRepository;
    let mockData: Currencies;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CurrenciesRepository],
        }).compile();

        repository = module.get<CurrenciesRepository>(CurrenciesRepository);
        mockData = { currency: 'USD', value: 1 } as Currencies;
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('getCurrency()', () => {
        it('should call findOne with correct params', async () => {
            repository.findOne = jest.fn().mockReturnValue({});
            await repository.getCurrency('USD');
            expect(repository.findOne).toBeCalledWith({ currency: 'USD' });
        });

        it('should throw if findOne returns empty', async () => {
            repository.findOne = jest.fn().mockReturnValue(undefined);
            await expect(repository.getCurrency('USD')).rejects.toThrow(
                new BadRequestException('Currency not found with the name: USD'),
            );
        });

        it('should return the value searched if it exists in the database', async () => {
            repository.findOne = jest.fn().mockReturnValue(mockData);
            expect(await repository.getCurrency('USD')).toEqual(mockData);
        });
    });

    describe('createCurrency()', () => {
        // it('should call findOne with correct params', async () => {
        //     repository.findOne = jest.fn().mockReturnValue({});
        //     await repository.getCurrency('USD');
        //     expect(repository.findOne).toBeCalledWith({ currency: 'USD' });
        // });
        // it('should throw if findOne returns empty', async () => {
        //     repository.findOne = jest.fn().mockReturnValue(undefined);
        //     await expect(repository.getCurrency('USD')).rejects.toThrow(
        //         new BadRequestException('Currency not found with the name: USD'),
        //     );
        // });
        // it('should return the value searched if it exists in the database', async () => {
        //     repository.findOne = jest.fn().mockReturnValue(mockData);
        //     expect(await repository.getCurrency('USD')).toEqual(mockData);
        // });
    });
});
