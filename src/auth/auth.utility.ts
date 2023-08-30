import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthUtility {
  /**
   * @Responsibility: fxn to get data as plain and editable after sequelize query
   *
   * @param data
   * @returns {*}
   */

  getPlainData(data: any): any {
    if (Array.isArray(data)) {
      return data.map((d) => d.get({ plain: true }));
    }
    return data.get({ plain: true });
  }
}
