import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';
import { UpdateContactSubmissionDto } from './dto/update-contact-submission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactSubmissionDto: CreateContactSubmissionDto) {
    return this.contactService.create(createContactSubmissionDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('status') status?: string) {
    return this.contactService.findAll(status);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats() {
    return this.contactService.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateContactSubmissionDto: UpdateContactSubmissionDto) {
    return this.contactService.update(+id, updateContactSubmissionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }
}

