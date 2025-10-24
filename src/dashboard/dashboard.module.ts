import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Class } from '../classes/entities/class.entity';
import { Task } from '../tasks/entities/task.entity';
import { CalendarEvent } from '../calendar/entities/calendar-event.entity';
import { User } from '../users/entities/user.entity';
import { School } from '../schools/entities/school.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      Teacher,
      Class,
      Task,
      CalendarEvent,
      User,
      School
    ])
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService]
})
export class DashboardModule {}

