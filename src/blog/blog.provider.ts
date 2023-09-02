import { Sequelize } from 'sequelize-typescript';
import { BLOG_REPOSITORY, SEQUELIZE_INSTANCE } from 'src/common/constant';
import { Blog } from 'src/schema/blog.schema';

/* This provider will be used to communicate with the database */
export const blogProvider = [
  {
    provide: BLOG_REPOSITORY,
    useValue: Blog,
  },
];

/* This provider will be used as a sequelize instance */
export const sequelizeInstanceProvider = [
  {
    provide: SEQUELIZE_INSTANCE,
    useValue: Sequelize,
  },
];
