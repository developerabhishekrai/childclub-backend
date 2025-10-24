import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { School } from '../../schools/entities/school.entity';

export enum SubjectStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'code', type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'status', type: 'enum', enum: SubjectStatus, default: SubjectStatus.ACTIVE })
  status: SubjectStatus;

  @Column({ name: 'schoolId', type: 'int' })
  schoolId: number;

  @Column({ name: 'gradeLevel', type: 'varchar', length: 50, nullable: true })
  gradeLevel: string;

  @Column({ name: 'totalMarks', type: 'int', nullable: true })
  totalMarks: number;

  @Column({ name: 'passingMarks', type: 'int', nullable: true })
  passingMarks: number;

  @Column({ name: 'isElective', type: 'tinyint', default: 0 })
  isElective: number;

  @Column({ name: 'color', type: 'varchar', length: 20, nullable: true })
  color: string;

  @Column({ name: 'icon', type: 'varchar', length: 50, nullable: true })
  icon: string;

  @Column({ name: 'isActive', type: 'tinyint', default: 1 })
  isActive: number;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime', precision: 6 })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => School, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'schoolId' })
  school: School;
}

