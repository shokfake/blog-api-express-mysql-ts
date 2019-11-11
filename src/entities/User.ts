import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const currentTimestamp = (): string => 'CURRENT_TIMESTAMP';

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

  @Column('timestamp', { default: currentTimestamp })
  public createDate!: Date;

  // todo: research how can I add an "onUpdate" value
  @Column('timestamp', { default: currentTimestamp })
  public lastUpdated!: Date;

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
