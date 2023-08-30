import { Inject, Injectable } from '@nestjs/common';
import { PropDataInput } from 'src/common/interface';
import { User } from 'src/schema/auth.schema';
import { USER_REPOSITORY } from 'src/common/constant';

@Injectable()
export class AuthRepository {
  constructor(@Inject(USER_REPOSITORY) private readonly user: typeof User) {}

  /**
   * @Responsibility: Repo to retrieve user detail
   *
   * @param where
   * @returns {Promise<User | void>}
   */

  async findUser(where: PropDataInput, attributes: string[]): Promise<Partial<User>> {
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
}
