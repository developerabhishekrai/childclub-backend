import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { User } from '../users/entities/user.entity';
import { School } from '../schools/entities/school.entity';
import { Class } from '../classes/entities/class.entity';
import { Student } from './entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, School, Class, Student])],
  providers: [StudentsService],
  controllers: [StudentsController],
  exports: [StudentsService],
})
export class StudentsModule {}


