import * as dotenv from 'dotenv';
import { IDatabaseConfig } from './interfaces/db.interface';

dotenv.config();

export const databaseConfig: IDatabaseConfig = {
  development: {
    dbUser: process.env.DB_USERNAME,
    dbPass: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
  },
  staging: {
    dbUser: process.env.STAGING_DB_USERNAME,
    dbPass: process.env.STAGING_DB_PASSWORD,
    dbName: process.env.STAGING_DB_NAME,
    dbHost: process.env.STAGING_DB_HOST,
    dbPort: process.env.DB_PORT,
  },
};
