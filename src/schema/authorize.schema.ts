import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ schema: 'linka_workspace', tableName: 'Authorizes' })
export class Authorize extends Model<Authorize> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ver_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code: string;
}
