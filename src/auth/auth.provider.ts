import { User } from '../schema/auth.schema';
import { Sequelize } from 'sequelize-typescript';
import { USER_REPOSITORY, SEQUELIZE_INSTANCE, AUTHORIZE_REPOSITORY } from '../common/constant';
import { Authorize } from '../schema/authorize.schema';

/* This provider will be used to communicate with the database */
export const authProvider = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
  {
    provide: AUTHORIZE_REPOSITORY,
    useValue: Authorize,
  },
];

/* This provider will be used as a sequelize instance */
export const sequelizeInstanceProvider = [
  {
    provide: SEQUELIZE_INSTANCE,
    useValue: Sequelize,
  },
];
