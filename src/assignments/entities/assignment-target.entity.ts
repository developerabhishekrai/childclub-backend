import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Assignment } from './assignment.entity';

export enum TargetType {
  CLASS = 'class',
  STUDENT = 'student',
  TEACHER = 'teacher',
}

@Entity('assignment_targets')
export class AssignmentTarget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  assignmentId: number;

  @Column({
    type: 'enum',
    enum: TargetType,
  })
  targetType: TargetType;

  @Column()
  targetId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Assignment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignmentId' })
  assignment: Assignment;
}

