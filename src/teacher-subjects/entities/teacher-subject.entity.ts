import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Class } from '../../classes/entities/class.entity';

@Entity('teacher_subjects')
export class TeacherSubject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'teacherId', type: 'int' })
  teacherId: number;

  @Column({ name: 'subjectId', type: 'int' })
  subjectId: number;

  @Column({ name: 'classId', type: 'int', nullable: true })
  classId: number;

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

  @ManyToOne(() => Subject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;

  @ManyToOne(() => Class, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classId' })
  class: Class;
}

