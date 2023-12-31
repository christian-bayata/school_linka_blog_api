import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from './auth.schema';

@Table({ schema: 'linka_workspace', tableName: 'Blogs' })
export class Blog extends Model<Blog> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  creator: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  likesCount: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  viewsCount: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  commentsCount: number;

  /************************************* Relations *******************************************/
  @BelongsTo(() => User)
  user: User;
}
