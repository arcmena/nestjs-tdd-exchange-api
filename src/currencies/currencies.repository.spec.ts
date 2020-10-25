import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
        beforeEach(() => {
            repository.save = jest.fn();
        });

        it('should call create with correct params', async () => {
            repository.create = jest.fn().mockReturnValue(mockData);
            await repository.createCurrency(mockData);
            expect(repository.create).toBeCalledWith(mockData);
        });

        it('should throw when create throw', async () => {
            repository.create = jest.fn().mockRejectedValue(new InternalServerErrorException());
            await expect(repository.createCurrency(mockData)).rejects.toThrow(
                new InternalServerErrorException(),
            );
        });

        it('should call save after calling create', async () => {
            repository.create = jest.fn().mockReturnValue(mockData);
            repository.save = jest.fn().mockReturnValue(mockData);
            await repository.createCurrency(mockData);
            expect(repository.create).toBeCalledWith(mockData);
            expect(repository.save).toBeCalledWith(mockData);
        });

        it('should throw when save throw', async () => {
            repository.create = jest.fn().mockReturnValue(mockData);
            repository.save = jest.fn().mockRejectedValue(new InternalServerErrorException());
            await expect(repository.createCurrency(mockData)).rejects.toThrow(
                new InternalServerErrorException(),
            );
        });

        it('should return the created data', async () => {
            repository.create = jest.fn().mockReturnValue(mockData);
            expect(await repository.createCurrency(mockData)).toEqual(mockData);
        });
    });
});
