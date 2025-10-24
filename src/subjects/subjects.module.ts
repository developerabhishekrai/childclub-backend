import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
import { Subject } from './entities/subject.entity';
import { School } from '../schools/entities/school.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, School])],
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [SubjectsService],
})
export class SubjectsModule {}

