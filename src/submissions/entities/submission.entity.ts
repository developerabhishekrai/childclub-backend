import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Assignment } from '../../assignments/entities/assignment.entity';

export enum SubmissionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  REVIEWED = 'reviewed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  RESUBMIT = 'resubmit'
}

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'taskId', type: 'int' })
  taskId: number;

  @Column({ name: 'studentId', type: 'int' })
  studentId: number;

  @Column({ name: 'status', type: 'enum', enum: SubmissionStatus, default: SubmissionStatus.DRAFT })
  status: SubmissionStatus;

  @Column({ name: 'content', type: 'text', nullable: true })
  content: string;

  @Column({ name: 'attachments', type: 'json', nullable: true })
  attachments: any;

  @Column({ name: 'submittedAt', type: 'datetime', nullable: true })
  submittedAt: Date;

  @Column({ name: 'reviewedAt', type: 'datetime', nullable: true })
  reviewedAt: Date;

  @Column({ name: 'reviewedById', type: 'int', nullable: true })
  reviewedById: number;

  @Column({ name: 'grade', type: 'decimal', precision: 5, scale: 2, nullable: true })
  grade: number;

  @Column({ name: 'feedback', type: 'text', nullable: true })
  feedback: string;

  @Column({ name: 'teacherNotes', type: 'text', nullable: true })
  teacherNotes: string;

  @Column({ name: 'attempts', type: 'int', default: 1 })
  attempts: number;

  @Column({ name: 'isLate', type: 'tinyint', default: 0 })
  isLate: number;

  @Column({ name: 'lateReason', type: 'text', nullable: true })
  lateReason: string;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime', precision: 6 })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Assignment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Assignment;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reviewedById' })
  reviewer: User;
}

