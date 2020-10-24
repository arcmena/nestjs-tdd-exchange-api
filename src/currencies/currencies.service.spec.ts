import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesRepository, CurrenciesService } from './currencies.service';

describe('CurrenciesService', () => {
    let service: CurrenciesService;
    let repository: CurrenciesRepository;
    let mockData;

    beforeEach(async () => {
        const currenciesRepositoryMock = {
            getCurrency: jest.fn(),
            createCurrency: jest.fn(),
            updateCurrency: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CurrenciesService,
                {
                    provide: CurrenciesRepository,
                    useFactory: () => currenciesRepositoryMock,
                },
            ],
        }).compile();

        service = module.get<CurrenciesService>(CurrenciesService);
        repository = module.get<CurrenciesRepository>(CurrenciesRepository);
        mockData = { currency: 'USD', value: 1 };
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getCurrency()', () => {
        it('should throw if repository throw', async () => {
            (repository.getCurrency as jest.Mock).mockRejectedValue(
                new InternalServerErrorException(),
            );

            await expect(service.getCurrency('INVALID')).rejects.toThrow(
                new InternalServerErrorException(),
            );
        });

        it('should not throw if repository returns', async () => {
            await expect(service.getCurrency('USD')).resolves.not.toThrow();
        });

        it('should call repository with correct param', async () => {
            await service.getCurrency('USD');
            expect(repository.getCurrency).toBeCalledWith('USD');
        });

        it('should return when repository return correct value', async () => {
            (repository.getCurrency as jest.Mock).mockReturnValue(mockData);
            expect(await service.getCurrency('USD')).toEqual(mockData);
        });
    });

    describe('createCurrency()', () => {
        it('should throw if repository throw', async () => {
            (repository.createCurrency as jest.Mock).mockRejectedValue(
                new InternalServerErrorException(),
            );

            mockData.currency = 'INVALID';
            await expect(service.createCurrency(mockData)).rejects.toThrow(
                new InternalServerErrorException(),
            );
        });

        it('should not throw if repository returns', async () => {
            await expect(service.createCurrency(mockData)).resolves.not.toThrow();
        });

        it('should call repository with correct param', async () => {
            await service.createCurrency(mockData);
            expect(repository.createCurrency).toBeCalledWith(mockData);
        });

        it('should throw if value <= 0', async () => {
            mockData.value = 0;
            await expect(service.createCurrency(mockData)).rejects.toThrow(
                new BadRequestException('The value must be greater than zero.'),
            );
        });

        it('should return when repository return correct value', async () => {
            (repository.createCurrency as jest.Mock).mockReturnValue(mockData);
            expect(await service.createCurrency(mockData)).toEqual(mockData);
        });
    });

    describe('updateCurrency()', () => {
        it('should throw if repository throw', async () => {
            (repository.updateCurrency as jest.Mock).mockRejectedValue(
                new InternalServerErrorException(),
            );

            mockData.currency = 'INVALID';
            await expect(service.updateCurrency(mockData)).rejects.toThrow(
                new InternalServerErrorException(),
            );
        });

        it('should not throw if repository returns', async () => {
            await expect(service.updateCurrency(mockData)).resolves.not.toThrow();
        });

        it('should call repository with correct param', async () => {
            await service.updateCurrency(mockData);
            expect(repository.updateCurrency).toBeCalledWith(mockData);
        });

        it('should throw if currency is not defined or value <= 0', async () => {
            mockData.currency = undefined;
            await expect(service.updateCurrency(mockData)).rejects.toThrow(
                new BadRequestException('The currency name must be stated.'),
            );

            mockData.value = 0;
            await expect(service.updateCurrency(mockData)).rejects.toThrow(
                new BadRequestException('The value must be greater than zero.'),
            );
        });

        it('should return when repository return correct value', async () => {
            (repository.updateCurrency as jest.Mock).mockReturnValue(mockData);
            expect(await service.updateCurrency(mockData)).toEqual(mockData);
        });
    });
});
