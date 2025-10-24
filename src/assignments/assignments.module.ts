import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './entities/assignment.entity';
import { AssignmentTarget } from './entities/assignment-target.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { TeacherClass } from '../teachers/entities/teacher-class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, AssignmentTarget, Student, Teacher, TeacherClass])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}



