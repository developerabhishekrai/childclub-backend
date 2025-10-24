import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { Class } from '../classes/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Class])],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}


