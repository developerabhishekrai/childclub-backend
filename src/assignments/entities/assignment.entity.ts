import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  schoolId: number;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column({ length: 100 })
  type: string;

  @Column({ length: 50 })
  priority: string;

  @Column({ length: 50, default: 'pending' })
  status: string;

  @Column('datetime')
  dueDate: Date;

  @Column()
  maxScore: number;

  @Column('text', { nullable: true })
  instructions: string;

  @Column('text', { nullable: true })
  rubric: string;

  @Column('json', { nullable: true })
  tags: string[];

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ length: 50, nullable: true })
  recurringPattern: string;

  @Column()
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

