import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactSubmission } from './entities/contact-submission.entity';
import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';
import { UpdateContactSubmissionDto } from './dto/update-contact-submission.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactSubmission)
    private readonly contactRepository: Repository<ContactSubmission>,
  ) {}

  async create(createContactSubmissionDto: CreateContactSubmissionDto): Promise<ContactSubmission> {
    const contactSubmission = this.contactRepository.create(createContactSubmissionDto);
    return await this.contactRepository.save(contactSubmission);
  }

  async findAll(status?: string): Promise<ContactSubmission[]> {
    const query = this.contactRepository.createQueryBuilder('contact');
    
    if (status) {
      query.where('contact.status = :status', { status });
    }
    
    query.orderBy('contact.created_at', 'DESC');
    
    return await query.getMany();
  }

  async findOne(id: number): Promise<ContactSubmission> {
    const contactSubmission = await this.contactRepository.findOne({ where: { id } });
    
    if (!contactSubmission) {
      throw new NotFoundException(`Contact submission with ID ${id} not found`);
    }
    
    return contactSubmission;
  }

  async update(id: number, updateContactSubmissionDto: UpdateContactSubmissionDto): Promise<ContactSubmission> {
    const contactSubmission = await this.findOne(id);
    
    Object.assign(contactSubmission, updateContactSubmissionDto);
    
    return await this.contactRepository.save(contactSubmission);
  }

  async remove(id: number): Promise<void> {
    const contactSubmission = await this.findOne(id);
    await this.contactRepository.remove(contactSubmission);
  }

  async getStats(): Promise<any> {
    const total = await this.contactRepository.count();
    const pending = await this.contactRepository.count({ where: { status: 'pending' } });
    const inProgress = await this.contactRepository.count({ where: { status: 'in_progress' } });
    const resolved = await this.contactRepository.count({ where: { status: 'resolved' } });
    const closed = await this.contactRepository.count({ where: { status: 'closed' } });
    
    return {
      total,
      pending,
      inProgress,
      resolved,
      closed,
    };
  }
}

