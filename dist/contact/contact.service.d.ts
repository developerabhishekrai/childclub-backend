import { Repository } from 'typeorm';
import { ContactSubmission } from './entities/contact-submission.entity';
import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';
import { UpdateContactSubmissionDto } from './dto/update-contact-submission.dto';
export declare class ContactService {
    private readonly contactRepository;
    constructor(contactRepository: Repository<ContactSubmission>);
    create(createContactSubmissionDto: CreateContactSubmissionDto): Promise<ContactSubmission>;
    findAll(status?: string): Promise<ContactSubmission[]>;
    findOne(id: number): Promise<ContactSubmission>;
    update(id: number, updateContactSubmissionDto: UpdateContactSubmissionDto): Promise<ContactSubmission>;
    remove(id: number): Promise<void>;
    getStats(): Promise<any>;
}
