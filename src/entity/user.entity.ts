import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { LoginType } from 'src/configs/login.type';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  @Type(() => Number)
  @IsNumber()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: LoginType, default: LoginType.PHONE })
  loginType: LoginType;

  @Column({ nullable: true, unique: true })
  phoneNum: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  socialId: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  profileImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
