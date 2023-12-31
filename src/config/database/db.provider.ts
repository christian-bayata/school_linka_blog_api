import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, STAGING } from '../../common/constant';
import { databaseConfig } from './db.config';
import { User } from '../../schema/auth.schema';
import { Authorize } from '../../schema/authorize.schema';
import { Blog } from '../../schema/blog.schema';
import { Engagement } from '../../schema/engagement.schema';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config: any;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = `postgres://${databaseConfig.development.dbUser}:${databaseConfig.development.dbPass}@${databaseConfig.development.dbHost}:${databaseConfig.development.dbPort}/${databaseConfig.development.dbName}`;
          break;
        case STAGING:
          config = `postgres://${databaseConfig.staging.dbUser}:${databaseConfig.staging.dbPass}@${databaseConfig.staging.dbHost}:${databaseConfig.staging.dbPort}/${databaseConfig.staging.dbName}`;
          break;
        default:
          config = `postgres://${databaseConfig.development.dbUser}:${databaseConfig.development.dbPass}@${databaseConfig.development.dbHost}:${databaseConfig.development.dbPort}/${databaseConfig.development.dbName}`;
      }

      const sequelize = new Sequelize(config, { dialect: 'postgres' });
      sequelize.addModels([User, Authorize, Blog, Engagement]);

      /* Connect to postgres database */
      await sequelize
        //.sync()
        .authenticate()
        .then(() => {
          console.log(`Connected to the database successfully`);
        })
        .catch((err: any) => {
          console.log('Unable to connect to the database', err);
        });

      return sequelize;
    },
  },
];
