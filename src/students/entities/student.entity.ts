import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { School } from '../../schools/entities/school.entity';
import { Class } from '../../classes/entities/class.entity';

export enum StudentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  GRADUATED = 'graduated',
  TRANSFERRED = 'transferred',
  SUSPENDED = 'suspended'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-'
}

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId', type: 'int' })
  userId: number;

  @Column({ name: 'schoolId', type: 'int' })
  schoolId: number;

  @Column({ name: 'studentId', type: 'varchar', length: 50, unique: true })
  studentId: string;

  @Column({ name: 'rollNumber', type: 'varchar', length: 20, nullable: true })
  rollNumber: string;

  @Column({ name: 'admissionNumber', type: 'varchar', length: 50, nullable: true })
  admissionNumber: string;

  @Column({ name: 'enrollNumber', type: 'varchar', length: 50, nullable: true })
  enrollNumber: string;

  @Column({ name: 'dateOfBirth', type: 'date' })
  dateOfBirth: Date;

  @Column({ name: 'gender', type: 'enum', enum: Gender, default: Gender.OTHER })
  gender: Gender;

  @Column({ name: 'bloodGroup', type: 'enum', enum: BloodGroup, nullable: true })
  bloodGroup: BloodGroup;

  @Column({ name: 'parentName', type: 'varchar', length: 255, nullable: true })
  parentName: string;

  @Column({ name: 'parentPhone', type: 'varchar', length: 20, nullable: true })
  parentPhone: string;

  @Column({ name: 'parentEmail', type: 'varchar', length: 255, nullable: true })
  parentEmail: string;

  @Column({ name: 'emergencyContact', type: 'varchar', length: 255, nullable: true })
  emergencyContact: string;

  @Column({ name: 'enrollmentDate', type: 'date' })
  enrollmentDate: Date;

  @Column({ name: 'currentClassId', type: 'int', nullable: true })
  currentClassId: number;

  @Column({ name: 'previousSchool', type: 'varchar', length: 255, nullable: true })
  previousSchool: string;

  @Column({ name: 'academicYear', type: 'varchar', length: 20, nullable: true })
  academicYear: string;

  @Column({ name: 'status', type: 'enum', enum: StudentStatus, default: StudentStatus.ACTIVE })
  status: StudentStatus;

  @Column({ name: 'isActive', type: 'tinyint', default: 1 })
  isActive: number;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime', precision: 6 })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => School, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'schoolId' })
  school: School;

  @ManyToOne(() => Class, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'currentClassId' })
  currentClass: Class;
}
