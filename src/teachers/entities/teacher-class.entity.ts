import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Teacher } from './teacher.entity';
import { Class } from '../../classes/entities/class.entity';

@Entity('teacher_classes')
export class TeacherClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'teacherId', type: 'int' })
  teacherId: number;

  @Column({ name: 'classId', type: 'int' })
  classId: number;

  @Column({ name: 'isPrimary', type: 'tinyint', default: 0, comment: '1 if this is the teacher primary class' })
  isPrimary: number;

  @Column({ name: 'isActive', type: 'tinyint', default: 1 })
  isActive: number;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'datetime', precision: 6 })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Teacher, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @ManyToOne(() => Class, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classId' })
  class: Class;
}

