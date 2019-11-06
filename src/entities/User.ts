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

  @Column()
  public birthDate: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  public createDate!: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  public lastUpdated!: Date;

  @Column({ default: true })
  public status!: boolean;

  constructor(
    username: string,
    displayName: string,
    bio: string,
    birthDate: Date
  ) {
    this.username = username;
    this.displayName = displayName;
    this.bio = bio;
    this.birthDate = birthDate;
  }
}
