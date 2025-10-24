import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum SchoolType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  HIGHER_SECONDARY = 'higher_secondary',
  INTERNATIONAL = 'international',
  SPECIAL_NEEDS = 'special_needs'
}

export enum SchoolStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended'
}

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 200 })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ name: 'type', type: 'enum', enum: SchoolType, default: SchoolType.PRIMARY })
  type: SchoolType;

  @Column({ name: 'status', type: 'enum', enum: SchoolStatus, default: SchoolStatus.PENDING })
  status: SchoolStatus;

  @Column({ name: 'logo', type: 'varchar', length: 255, nullable: true })
  logo: string;

  @Column({ name: 'banner', type: 'varchar', length: 255, nullable: true })
  banner: string;

  @Column({ name: 'city', type: 'varchar', length: 100 })
  city: string;

  @Column({ name: 'state', type: 'varchar', length: 100 })
  state: string;

  @Column({ name: 'country', type: 'varchar', length: 100 })
  country: string;

  @Column({ name: 'postalCode', type: 'varchar', length: 20 })
  postalCode: string;

  @Column({ name: 'phone', type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ name: 'website', type: 'varchar', length: 100, nullable: true })
  website: string;

  @Column({ name: 'email', type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ name: 'establishedYear', type: 'int', nullable: true })
  establishedYear: number;

  @Column({ name: 'totalStudents', type: 'int', nullable: true })
  totalStudents: number;

  @Column({ name: 'totalTeachers', type: 'int', nullable: true })
  totalTeachers: number;

  @Column({ name: 'totalClasses', type: 'int', nullable: true })
  totalClasses: number;

  @Column({ name: 'facilities', type: 'text', nullable: true })
  facilities: string;

  @Column({ name: 'achievements', type: 'text', nullable: true })
  achievements: string;

  @Column({ name: 'vision', type: 'text', nullable: true })
  vision: string;

  @Column({ name: 'mission', type: 'text', nullable: true })
  mission: string;

  @Column({ name: 'isActive', type: 'tinyint', default: 1 })
  isActive: number;

  @Column({ name: 'approvedAt', type: 'datetime', nullable: true })
  approvedAt: Date;

  @Column({ name: 'approvedBy', type: 'int', nullable: true })
  approvedBy: number;

  @Column({ name: 'rejectionReason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ name: 'user_id', type: 'int', nullable: true })
  userId: number;

  @Column({ name: 'address', type: 'varchar', length: 200 })
  address: string;

  @Column({ name: 'workingHours', type: 'json', nullable: true })
  workingHours: any;

  @Column({ name: 'holidays', type: 'json', nullable: true })
  holidays: any;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime', precision: 6 })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}


