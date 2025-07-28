import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
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

  @IsString()
  @Column()
  name: string;

  @Column({ type: 'enum', enum: LoginType, default: LoginType.PHONE })
  loginType: LoginType;

  @IsString()
  @Column({ nullable: true, unique: true })
  phoneNum: string;

  @IsString()
  @Column({ nullable: true, unique: true })
  email: string;

  @IsString()
  @Column({ nullable: true, unique: true })
  socialId: string;

  @IsString()
  @Column({ nullable: true })
  profileImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
