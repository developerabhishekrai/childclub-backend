import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Class } from '../../classes/entities/class.entity';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused',
  HALF_DAY = 'half_day'
}

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'studentId', type: 'int' })
  studentId: number;

  @Column({ name: 'classId', type: 'int' })
  classId: number;

  @Column({ name: 'teacherId', type: 'int', nullable: true })
  teacherId: number;

  @Column({ name: 'date', type: 'date' })
  date: Date;

  @Column({ name: 'status', type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.PRESENT })
  status: AttendanceStatus;

  @Column({ name: 'remarks', type: 'text', nullable: true })
  remarks: string;

  @Column({ name: 'checkInTime', type: 'time', nullable: true })
  checkInTime: string;

  @Column({ name: 'checkOutTime', type: 'time', nullable: true })
  checkOutTime: string;

  @Column({ name: 'temperature', type: 'decimal', precision: 4, scale: 1, nullable: true })
  temperature: number;

  @Column({ name: 'mood', type: 'varchar', length: 50, nullable: true })
  mood: string;

  @Column({ name: 'parentNotified', type: 'tinyint', default: 0 })
  parentNotified: number;

  @Column({ name: 'notificationSentAt', type: 'datetime', nullable: true })
  notificationSentAt: Date;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime', precision: 6 })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: User;

  @ManyToOne(() => Class, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classId' })
  class: Class;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'teacherId' })
  teacher: User;
}

