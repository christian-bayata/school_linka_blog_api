import { Sequelize } from 'sequelize-typescript';
import { BLOG_REPOSITORY, ENGAGEMENT_REPOSITORY, SEQUELIZE_INSTANCE } from 'src/common/constant';
import { Blog } from 'src/schema/blog.schema';
import { Engagement } from 'src/schema/engagement.schema';

/* This provider will be used to communicate with the database */
export const blogProvider = [
  {
    provide: BLOG_REPOSITORY,
    useValue: Blog,
  },

  {
    provide: ENGAGEMENT_REPOSITORY,
    useValue: Engagement,
  },
];

/* This provider will be used as a sequelize instance */
export const sequelizeInstanceProvider = [
  {
    provide: SEQUELIZE_INSTANCE,
    useValue: Sequelize,
  },
];
