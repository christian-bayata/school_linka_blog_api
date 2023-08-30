import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Role } from 'src/common/enums/role.enum';

@Table({ schema: 'linka_workspace', tableName: 'Users' })
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  first_name: JSON;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  last_name: JSON;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    defaultValue: Role.RWX_USER,
  })
  role: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  verified: string;

  @Column({
    type: DataType.STRING,
  })
  avatar: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  loginCount: number;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  lastLoggedIn: Date;

  /************************************* Relations *******************************************/
}
