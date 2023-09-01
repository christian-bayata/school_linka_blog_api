import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

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

  /**
   * @Responsibility: fxn to generate reset password token
   *
   * @param data
   * @returns {*}
   */

  resetToken(): string {
    const token = crypto.randomBytes(20).toString('hex');
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * @Responsibility: Fxn to create forgot password 6-digit code
   *
   * @returns {string}
   */

  generateCode(): string {
    let digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    digits = digits.sort(() => Math.random() - 0.5);
    return digits.slice(0, 6).join('');
  }
}
