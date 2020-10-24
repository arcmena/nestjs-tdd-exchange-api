import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesRepository, CurrenciesService } from './currencies.service';

describe('CurrenciesService', () => {
    let service: CurrenciesService;
    let repository: CurrenciesRepository;

    beforeEach(async () => {
        const currenciesRepositoryMock = {
            getCurrency: jest.fn(),
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

        it('should return when repository return correct param', async () => {
            (repository.getCurrency as jest.Mock).mockReturnValue({ currency: 'USD', value: 1 });
            expect(await service.getCurrency('usd')).toEqual({ currency: 'USD', value: 1 });
        });
    });
});
