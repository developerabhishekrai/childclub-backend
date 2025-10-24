import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Class } from '../../classes/entities/class.entity';

export enum TaskType {
  HOMEWORK = 'homework',
  PROJECT = 'project',
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
  ACTIVITY = 'activity',
  EXAM = 'exam'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title', type: 'varchar', length: 200 })
  title: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'type', type: 'enum', enum: TaskType, default: TaskType.HOMEWORK })
  type: TaskType;

  @Column({ name: 'priority', type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Column({ name: 'status', type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Column({ name: 'assignedDate', type: 'datetime', nullable: true })
  assignedDate: Date;

  @Column({ name: 'completedDate', type: 'datetime', nullable: true })
  completedDate: Date;

  @Column({ name: 'maxScore', type: 'int', nullable: true })
  maxScore: number;

  @Column({ name: 'passingScore', type: 'int', nullable: true })
  passingScore: number;

  @Column({ name: 'instructions', type: 'text', nullable: true })
  instructions: string;

  @Column({ name: 'rubric', type: 'text', nullable: true })
  rubric: string;

  @Column({ name: 'isActive', type: 'tinyint', default: 1 })
  isActive: number;

  @Column({ name: 'isRecurring', type: 'tinyint', default: 0 })
  isRecurring: number;

  @Column({ name: 'recurringPattern', type: 'varchar', length: 255, nullable: true })
  recurringPattern: string;

  @Column({ name: 'classId', type: 'int', nullable: true })
  classId: number;

  @Column({ name: 'createdById', type: 'int', nullable: true })
  createdById: number;

  @Column({ name: 'dueDate', type: 'datetime' })
  dueDate: Date;

  @Column({ name: 'attachments', type: 'json', nullable: true })
  attachments: any;

  @Column({ name: 'tags', type: 'json', nullable: true })
  tags: any;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime', precision: 6 })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Class, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'classId' })
  class: Class;

  @ManyToOne(() => User, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;
}


