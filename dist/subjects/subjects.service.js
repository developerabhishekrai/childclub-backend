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
exports.SubjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subject_entity_1 = require("./entities/subject.entity");
const school_entity_1 = require("../schools/entities/school.entity");
let SubjectsService = class SubjectsService {
    constructor(subjectsRepository, schoolsRepository) {
        this.subjectsRepository = subjectsRepository;
        this.schoolsRepository = schoolsRepository;
    }
    async createSubject(createSubjectDto) {
        const school = await this.schoolsRepository.findOne({
            where: { id: parseInt(createSubjectDto.schoolId) }
        });
        if (!school) {
            throw new common_1.NotFoundException('School not found');
        }
        const existingSubject = await this.subjectsRepository.findOne({
            where: {
                code: createSubjectDto.code,
                schoolId: parseInt(createSubjectDto.schoolId),
                isActive: 1
            },
        });
        if (existingSubject) {
            throw new common_1.BadRequestException('Subject code already exists in this school');
        }
        const subject = this.subjectsRepository.create({
            name: createSubjectDto.name,
            code: createSubjectDto.code,
            description: createSubjectDto.description,
            schoolId: parseInt(createSubjectDto.schoolId),
            gradeLevel: createSubjectDto.gradeLevel,
            totalMarks: createSubjectDto.totalMarks,
            passingMarks: createSubjectDto.passingMarks,
            isElective: createSubjectDto.isElective ? 1 : 0,
            color: createSubjectDto.color || '#3B82F6',
            icon: createSubjectDto.icon || '📚',
            status: createSubjectDto.status || subject_entity_1.SubjectStatus.ACTIVE,
            isActive: 1,
        });
        return this.subjectsRepository.save(subject);
    }
    async findAllSubjects(schoolId) {
        return this.subjectsRepository.find({
            where: { schoolId, isActive: 1 },
            order: { name: 'ASC' },
        });
    }
    async findSubjectById(id) {
        const subject = await this.subjectsRepository.findOne({
            where: { id, isActive: 1 }
        });
        if (!subject) {
            throw new common_1.NotFoundException('Subject not found');
        }
        return subject;
    }
    async findSubjectsByGrade(schoolId, gradeLevel) {
        return this.subjectsRepository.find({
            where: { schoolId, gradeLevel, isActive: 1 },
            order: { name: 'ASC' },
        });
    }
    async updateSubject(id, updateSubjectDto) {
        const subject = await this.findSubjectById(id);
        if (updateSubjectDto.code && updateSubjectDto.code !== subject.code) {
            const existingSubject = await this.subjectsRepository.findOne({
                where: {
                    code: updateSubjectDto.code,
                    schoolId: subject.schoolId,
                    isActive: 1
                },
            });
            if (existingSubject && existingSubject.id !== id) {
                throw new common_1.BadRequestException('Subject code already exists in this school');
            }
        }
        Object.assign(subject, updateSubjectDto);
        if (updateSubjectDto.isElective !== undefined) {
            subject.isElective = updateSubjectDto.isElective ? 1 : 0;
        }
        return this.subjectsRepository.save(subject);
    }
    async deleteSubject(id) {
        const subject = await this.findSubjectById(id);
        subject.isActive = 0;
        await this.subjectsRepository.save(subject);
    }
    async getSubjectStats(schoolId) {
        const subjects = await this.subjectsRepository.find({
            where: { schoolId, isActive: 1 }
        });
        const result = {
            total: subjects.length,
            active: 0,
            inactive: 0,
            elective: 0,
            core: 0,
        };
        subjects.forEach((subject) => {
            if (subject.status === subject_entity_1.SubjectStatus.ACTIVE) {
                result.active++;
            }
            else {
                result.inactive++;
            }
            if (subject.isElective) {
                result.elective++;
            }
            else {
                result.core++;
            }
        });
        return result;
    }
};
exports.SubjectsService = SubjectsService;
exports.SubjectsService = SubjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __param(1, (0, typeorm_1.InjectRepository)(school_entity_1.School)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SubjectsService);
//# sourceMappingURL=subjects.service.js.map