import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { School } from '../../schools/entities/school.entity';

export enum EventType {
  ACADEMIC = 'academic',
  EVENT = 'event',
  ACTIVITY = 'activity',
  CURRICULUM = 'curriculum',
  EXAM = 'exam',
  HOLIDAY = 'holiday',
  MEETING = 'meeting'
}

export enum EventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum EventStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  POSTPONED = 'postponed'
}

export enum RecurringPattern {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

@Entity('calendar_events')
export class CalendarEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'eventType', type: 'enum', enum: EventType, default: EventType.EVENT })
  eventType: EventType;

  @Column({ name: 'startDate', type: 'datetime' })
  startDate: Date;

  @Column({ name: 'endDate', type: 'datetime', nullable: true })
  endDate: Date;

  @Column({ name: 'allDay', type: 'tinyint', default: 0 })
  allDay: number;

  @Column({ name: 'location', type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ name: 'color', type: 'varchar', length: 7, default: '#007bff' })
  color: string;

  @Column({ name: 'priority', type: 'enum', enum: EventPriority, default: EventPriority.MEDIUM })
  priority: EventPriority;

  @Column({ name: 'attendees', type: 'json', nullable: true })
  attendees: any;

  @Column({ name: 'isRecurring', type: 'tinyint', default: 0 })
  isRecurring: number;

  @Column({ name: 'recurringPattern', type: 'enum', enum: RecurringPattern, nullable: true })
  recurringPattern: RecurringPattern;

  @Column({ name: 'recurringEndDate', type: 'date', nullable: true })
  recurringEndDate: Date;

  @Column({ name: 'schoolId', type: 'int' })
  schoolId: number;

  @Column({ name: 'createdById', type: 'int' })
  createdById: number;

  @Column({ name: 'status', type: 'enum', enum: EventStatus, default: EventStatus.ACTIVE })
  status: EventStatus;

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

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;
}

