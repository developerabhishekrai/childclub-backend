import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherSubjectsController } from './teacher-subjects.controller';
import { TeacherSubjectsService } from './teacher-subjects.service';
import { TeacherSubject } from './entities/teacher-subject.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { Class } from '../classes/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherSubject, Teacher, Subject, Class])],
  controllers: [TeacherSubjectsController],
  providers: [TeacherSubjectsService],
  exports: [TeacherSubjectsService],
})
export class TeacherSubjectsModule {}

