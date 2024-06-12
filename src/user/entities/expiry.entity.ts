import { IsDateString, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class ExpiryDto {
  @IsNumber()
  id: number;

  @IsString()
  token: string; // 사용중지 된 accesstoken, refreshtoken

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}

@Entity()
export class Expiry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', comment: '사용중지 된 accesstoken, refreshtoken' })
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<Expiry>) {
    Object.assign(this, partial);
  }
}
