import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { ContactSubmission } from './entities/contact-submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactSubmission])],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}

