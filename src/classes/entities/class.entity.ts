import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { School } from '../../schools/entities/school.entity';

export enum ClassStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed'
}

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'grade', type: 'varchar', length: 10 })
  grade: string;

  @Column({ name: 'section', type: 'varchar', length: 10, nullable: true })
  section: string;

  @Column({ name: 'description', type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ name: 'status', type: 'enum', enum: ClassStatus, default: ClassStatus.ACTIVE })
  status: ClassStatus;

  @Column({ name: 'academicYear', type: 'varchar', length: 255, nullable: true })
  academicYear: string;

  @Column({ name: 'startDate', type: 'datetime', nullable: true })
  startDate: Date;

  @Column({ name: 'endDate', type: 'datetime', nullable: true })
  endDate: Date;

  @Column({ name: 'maxStudents', type: 'int', nullable: true })
  maxStudents: number;

  @Column({ name: 'currentStudents', type: 'int', nullable: true })
  currentStudents: number;

  @Column({ name: 'syllabus', type: 'text', nullable: true })
  syllabus: string;

  @Column({ name: 'rules', type: 'text', nullable: true })
  rules: string;

  @Column({ name: 'isActive', type: 'tinyint', default: 1 })
  isActive: number;

  @Column({ name: 'schoolId', type: 'int', nullable: true })
  schoolId: number;

  @Column({ name: 'classTeacherId', type: 'int', nullable: true })
  classTeacherId: number;

  @Column({ name: 'schedule', type: 'json', nullable: true })
  schedule: any;

  @Column({ name: 'subjects', type: 'json', nullable: true })
  subjects: any;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime', precision: 6 })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => School, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'schoolId' })
  school: School;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'classTeacherId' })
  classTeacher: User;
}


