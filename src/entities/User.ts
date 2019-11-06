import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    unique: true,
    length: 16
  })
  public username: string;

  @Column({
    length: 50
  })
  public displayName: string;

  @Column({
    length: 255,
    default: ''
  })
  public bio: string;
}
