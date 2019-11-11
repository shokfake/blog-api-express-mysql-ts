import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ unique: true, length: 16 })
  public username: string;

  @Column({ length: 50 })
  public displayName: string;

  @Column({ length: 255, default: '' })
  public bio: string;

  @Column('date')
  public birthDate: string;

  @Column('timestamp', { default: 'CURRENT_TIMESTAMP' })
  public createDate!: string;

  // todo: research how can I add an "onUpdate" value
  @Column('timestamp', { default: 'CURRENT_TIMESTAMP' })
  public lastUpdated!: string;

  @Column({ default: true })
  public status!: boolean;

  constructor(
    username: string,
    displayName: string,
    bio: string,
    birthDate: string
  ) {
    this.username = username;
    this.displayName = displayName;
    this.bio = bio;
    this.birthDate = birthDate;
  }
}
