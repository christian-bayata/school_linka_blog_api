import { User } from 'src/schema/auth.schema';
import { Sequelize } from 'sequelize-typescript';
import { USER_REPOSITORY, SEQUELIZE_INSTANCE } from 'src/common/constant';

/* This provider will be used to communicate with the database */
export const authProvider = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];

/* This provider will be used as a sequelize instance */
export const sequelizeInstanceProvider = [
  {
    provide: SEQUELIZE_INSTANCE,
    useValue: Sequelize,
  },
];
