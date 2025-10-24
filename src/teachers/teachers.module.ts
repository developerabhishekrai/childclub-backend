import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { User } from '../users/entities/user.entity';
import { School } from '../schools/entities/school.entity';
import { Class } from '../classes/entities/class.entity';
import { Teacher } from './entities/teacher.entity';
import { TeacherClass } from './entities/teacher-class.entity';
import { Subject } from '../subjects/entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, School, Class, Teacher, TeacherClass, Subject])],
  providers: [TeachersService],
  controllers: [TeachersController],
  exports: [TeachersService],
})
export class TeachersModule {}


