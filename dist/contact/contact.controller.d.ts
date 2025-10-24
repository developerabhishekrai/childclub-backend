import { ContactService } from './contact.service';
import { CreateContactSubmissionDto } from './dto/create-contact-submission.dto';
import { UpdateContactSubmissionDto } from './dto/update-contact-submission.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactSubmissionDto: CreateContactSubmissionDto): Promise<import("./entities/contact-submission.entity").ContactSubmission>;
    findAll(status?: string): Promise<import("./entities/contact-submission.entity").ContactSubmission[]>;
    getStats(): Promise<any>;
    findOne(id: string): Promise<import("./entities/contact-submission.entity").ContactSubmission>;
    update(id: string, updateContactSubmissionDto: UpdateContactSubmissionDto): Promise<import("./entities/contact-submission.entity").ContactSubmission>;
    remove(id: string): Promise<void>;
}
