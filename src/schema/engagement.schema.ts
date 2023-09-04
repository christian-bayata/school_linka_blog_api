import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Blog } from './blog.schema';

@Table({ schema: 'linka_workspace', tableName: 'Engagements' })
export class Engagement extends Model<Engagement> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;

  @ForeignKey(() => Blog)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  post_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  engager: number;

  @Column({
    type: DataType.STRING,
  })
  comment: string;

  @Column({
    type: DataType.DATE,
  })
  likedAt: Date;

  @Column({
    type: DataType.DATE,
  })
  viewedAt: Date;

  @Column({
    type: DataType.DATE,
  })
  commentedAt: Date;

  /************************************* Relations *******************************************/
  @BelongsTo(() => Blog)
  post: Blog;
}
