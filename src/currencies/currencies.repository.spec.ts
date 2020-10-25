import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

// Entity
import { Currency } from './currency.entity';

// Repository
import { CurrenciesRepository } from './currencies.repository';

describe('CurrenciesRepository', () => {
    let repository: CurrenciesRepository;
    let mockData: Currency;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CurrenciesRepository],
        }).compile();

        repository = module.get<CurrenciesRepository>(CurrenciesRepository);
        mockData = { currency: 'USD', value: 1 } as Currency;
        repository.save = jest.fn();
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
                new NotFoundException('Currency not found with the name: USD'),
            );
        });

        it('should return the value searched if it exists in the database', async () => {
            repository.findOne = jest.fn().mockReturnValue(mockData);
            expect(await repository.getCurrency('USD')).toEqual(mockData);
        });
    });

    describe('createCurrency()', () => {
        it('should call save with correct params', async () => {
            repository.save = jest.fn().mockReturnValue(mockData);
            await repository.createCurrency(mockData);
            expect(repository.save).toBeCalledWith(mockData);
        });

        it('should throw when save throw', async () => {
            repository.save = jest.fn().mockRejectedValue(new InternalServerErrorException());
            await expect(repository.createCurrency(mockData)).rejects.toThrow(
                new InternalServerErrorException(),
            );
        });

        it('should throw if called with invalid params', async () => {
            mockData.currency = 'INVALID';
            mockData.value = 5;
            await expect(repository.createCurrency(mockData)).rejects.toThrow();

            mockData.currency = 'USD';
            mockData.value = null;
            await expect(repository.createCurrency(mockData)).rejects.toThrow();
        });

        it('should return the created data', async () => {
            repository.create = jest.fn().mockReturnValue(mockData);
            expect(await repository.createCurrency(mockData)).toEqual(mockData);
        });
    });

    describe('updateCurrency()', () => {
        it('should call findOne with correct params', async () => {
            repository.findOne = jest.fn().mockReturnValue({});
            await repository.updateCurrency(mockData);
            expect(repository.findOne).toBeCalledWith({ currency: 'USD' });
        });

        it('should throw if findOne returns empty', async () => {
            repository.findOne = jest.fn().mockReturnValue(undefined);
            await expect(repository.updateCurrency(mockData)).rejects.toThrow(
                new NotFoundException(`Currency not found with the name: ${mockData.currency}`),
            );
        });

        it('should call save with correct params', async () => {
            repository.findOne = jest.fn().mockReturnValue(mockData);
            repository.save = jest.fn().mockReturnValue(mockData);
            await repository.updateCurrency(mockData);
            expect(repository.save).toBeCalledWith(mockData);
        });

        it('should throw when save throw', async () => {
            repository.findOne = jest.fn().mockReturnValue(mockData);
            repository.save = jest.fn().mockRejectedValue(new InternalServerErrorException());
            await expect(repository.updateCurrency(mockData)).rejects.toThrow(
                new InternalServerErrorException(),
            );
        });

        it('should return updated data', async () => {
            repository.findOne = jest.fn().mockReturnValue({ currency: 'USD', value: 1 });
            repository.save = jest.fn().mockReturnValue({});
            const result = await repository.updateCurrency({ currency: 'USD', value: 2 });
            expect(result).toEqual({ currency: 'USD', value: 2 });
        });
    });

    describe('deleteCurrency()', () => {
        it('should call delete with correct param and return', async () => {
            repository.delete = jest.fn().mockReturnValue({ affected: 1 });
            await expect(repository.deleteCurrency('EUR')).resolves.not.toThrow();
        });

        it('should throw if affected columns === 0', async () => {
            repository.delete = jest.fn().mockReturnValue({ affected: 0 });
            mockData.currency = 'ERO';
            await expect(repository.deleteCurrency(mockData.currency)).rejects.toThrow(
                new NotFoundException(`Currency not found with the name: ${mockData.currency}`),
            );
        });

        it('should throw when delete throw ', async () => {
            repository.delete = jest.fn().mockRejectedValue(new Error());
            await expect(repository.deleteCurrency('EUR')).rejects.toThrow(new Error());
        });
    });
});
