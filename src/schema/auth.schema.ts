import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, Index } from 'sequelize-typescript';
import { Role } from '../common/enums/role.enum';
import { Blog } from './blog.schema';

/* Dedicated function for adding index to the Users table */
export function IndexedTable(indexFields: string[], indexName: string, isUnique: boolean = false) {
  return (target: any) => {
    Table(target);
    target.prototype.indexes = [
      {
        name: indexName,
        unique: isUnique,
        fields: indexFields,
      },
    ];
  };
}
@IndexedTable(['id', 'email'], 'users_index', true)
@Table({ schema: 'linka_workspace', tableName: 'Users' })
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  last_name: string;

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
  verified: boolean;

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
  @HasMany(() => Blog)
  posts: Blog[];
}
