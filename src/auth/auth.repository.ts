import { Inject, Injectable } from '@nestjs/common';
import { PropDataInput } from 'src/common/interface';
import { User } from 'src/schema/auth.schema';
import { USER_REPOSITORY, AUTHORIZE_REPOSITORY, SEQUELIZE } from 'src/common/constant';
import { Authorize } from 'src/schema/authorize.schema';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject(USER_REPOSITORY) private readonly user: typeof User,
    @Inject(AUTHORIZE_REPOSITORY) private readonly authorize: typeof Authorize,
    @Inject(SEQUELIZE) private sequelize: Sequelize,
  ) {}

  /**
   * @Responsibility: Repo to retrieve user detail
   *
   * @param where
   * @returns {Promise<User | void>}
   */

  async findUser(where: PropDataInput, attributes?: string[]): Promise<Partial<User>> {
    return await this.user.findOne({
      where,
      attributes,
    });
  }

  /**
   * @Responsibility: Repo to create a new user
   *
   * @param data
   * @returns {Promise<User | void>}
   */

  async createUser(data: any): Promise<Partial<User>> {
    return await this.user.create(data);
  }

  /**
   * @Responsibility: Repo for updating a user
   *
   * @param where
   * @returns {Promise<Survey | null>}
   */

  async updateUser(where: any, data: any): Promise<any> {
    return await this.user.update(data, { where });
  }

  /**
   * @Responsibility: Repo for retrieving verification id
   *
   * @param where
   * @returns {Promise<Survey | null>}
   */

  async findVerId(where: PropDataInput, attributes): Promise<Authorize> {
    return await this.authorize.findOne({ where, attributes });
  }

  /**
   * @Responsibility: Repo for verifying a user and deleting the verification id
   *
   * @param where
   * @returns {Promise<Survey | null>}
   */

  async verifyUserDeleteVerId(data: any): Promise<any> {
    try {
      return this.sequelize.transaction(async (t: any) => {
        await Promise.all([
          this.user.update({ verified: true }, { where: { email: data.email }, transaction: t }),
          this.authorize.destroy({ where: { ver_id: data.ver_id }, transaction: t }),
        ]);
      });
    } catch (error) {
      return { error };
    }
  }

  /**
   * @Responsibility: Repo to create a new user
   *
   * @param data
   * @returns {Promise<User | void>}
   */

  async createVerId(data: any): Promise<Partial<Authorize>> {
    return await this.authorize.create(data);
  }
}
