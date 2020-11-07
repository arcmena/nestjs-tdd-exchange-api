import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

class ConfigService {
    constructor(private env: { [k: string]: string | undefined }) {}

    private getValue(key: string, throwOnMissing = true): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error(`Config error - misssing env.${key}`);
        }

        return value;
    }

    public ensureValues(keys: string[]) {
        keys.forEach(k => this.getValue(k, true));
        return this;
    }

    public getPort() {
        return this.getValue('PORT', true);
    }

    public isProduction() {
        const mode = this.getValue('MODE', false);
        return mode != 'DEV';
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.getValue('DB_HOST'),
            port: parseInt(this.getValue('DB_PORT')),
            username: this.getValue('DB_USER'),
            password: this.getValue('DB_PASSWORD'),
            database: this.getValue('DB_DATABASE'),

            synchronize: true,

            entities: ['dist/**/*.entity{.ts,.js}'],
            migrationsTableName: 'migration',
            migrations: ['src/config/migrations/*.ts'],

            cli: {
                migrationsDir: 'src/config/migrations',
            },
        };
    }
}

const configService = new ConfigService(process.env).ensureValues([
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_DATABASE',
]);

export { configService };
