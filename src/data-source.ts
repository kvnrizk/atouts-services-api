import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { databaseSsl } from './database-ssl';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

export default new DataSource(
  databaseUrl
    ? {
        type: 'postgres',
        url: databaseUrl,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        ssl: databaseSsl(),
      }
    : {
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: +(process.env.DATABASE_PORT || 5432),
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'postgres',
        database: process.env.DATABASE_NAME || 'atousservice_db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      },
);
