import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { School } from '../../schools/entities/school.entity';

export enum TeacherStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  RESIGNED = 'resigned',
  RETIRED = 'retired',
  SUSPENDED = 'suspended'
}

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId', type: 'int' })
  userId: number;

  @Column({ name: 'schoolId', type: 'int' })
  schoolId: number;

  @Column({ name: 'classId', type: 'int', nullable: true })
  classId: number;

  @Column({ name: 'employeeId', type: 'varchar', length: 50, unique: true })
  employeeId: string;

  @Column({ name: 'qualification', type: 'varchar', length: 255, nullable: true })
  qualification: string;

  @Column({ name: 'specialization', type: 'varchar', length: 255, nullable: true })
  specialization: string;

  @Column({ name: 'experienceYears', type: 'int', default: 0 })
  experienceYears: number;

  @Column({ name: 'joiningDate', type: 'date' })
  joiningDate: Date;

  @Column({ name: 'salary', type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary: number;

  @Column({ name: 'department', type: 'varchar', length: 100, nullable: true })
  department: string;

  @Column({ name: 'designation', type: 'varchar', length: 100, nullable: true })
  designation: string;

  @Column({ name: 'emergencyContact', type: 'varchar', length: 255, nullable: true })
  emergencyContact: string;

  @Column({ name: 'status', type: 'enum', enum: TeacherStatus, default: TeacherStatus.ACTIVE })
  status: TeacherStatus;

  @Column({ name: 'subjects', type: 'json', nullable: true })
  subjects: string[];

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
}
