"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contact_submission_entity_1 = require("./entities/contact-submission.entity");
let ContactService = class ContactService {
    constructor(contactRepository) {
        this.contactRepository = contactRepository;
    }
    async create(createContactSubmissionDto) {
        const contactSubmission = this.contactRepository.create(createContactSubmissionDto);
        return await this.contactRepository.save(contactSubmission);
    }
    async findAll(status) {
        const query = this.contactRepository.createQueryBuilder('contact');
        if (status) {
            query.where('contact.status = :status', { status });
        }
        query.orderBy('contact.created_at', 'DESC');
        return await query.getMany();
    }
    async findOne(id) {
        const contactSubmission = await this.contactRepository.findOne({ where: { id } });
        if (!contactSubmission) {
            throw new common_1.NotFoundException(`Contact submission with ID ${id} not found`);
        }
        return contactSubmission;
    }
    async update(id, updateContactSubmissionDto) {
        const contactSubmission = await this.findOne(id);
        Object.assign(contactSubmission, updateContactSubmissionDto);
        return await this.contactRepository.save(contactSubmission);
    }
    async remove(id) {
        const contactSubmission = await this.findOne(id);
        await this.contactRepository.remove(contactSubmission);
    }
    async getStats() {
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
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contact_submission_entity_1.ContactSubmission)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ContactService);
//# sourceMappingURL=contact.service.js.map