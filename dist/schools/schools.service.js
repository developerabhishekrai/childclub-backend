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
exports.SchoolsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const school_entity_1 = require("./entities/school.entity");
let SchoolsService = class SchoolsService {
    constructor(schoolRepository) {
        this.schoolRepository = schoolRepository;
    }
    async findAll(options) {
        const { status, type, search, page, limit, userRole, schoolId } = options;
        const skip = (page - 1) * limit;
        const queryBuilder = this.schoolRepository.createQueryBuilder('school')
            .leftJoinAndSelect('school.user', 'user')
            .select([
            'school.id',
            'school.name',
            'school.type',
            'school.status',
            'school.city',
            'school.state',
            'school.country',
            'school.phone',
            'school.email',
            'school.website',
            'school.totalStudents',
            'school.totalTeachers',
            'school.totalClasses',
            'school.createdAt',
            'school.approvedAt',
            'school.approvedBy',
            'user.firstName',
            'user.lastName',
            'user.email',
        ])
            .where('school.isActive = :isActive', { isActive: 1 });
        if (userRole === 'school_admin' && schoolId) {
            queryBuilder.andWhere('school.id = :schoolId', { schoolId });
        }
        else if (userRole === 'teacher' || userRole === 'student') {
            if (schoolId) {
                queryBuilder.andWhere('school.id = :schoolId', { schoolId });
            }
            else {
                queryBuilder.andWhere('1 = 0');
            }
        }
        if (status && status !== 'all') {
            queryBuilder.andWhere('school.status = :status', { status });
        }
        if (type && type !== 'all') {
            queryBuilder.andWhere('school.type = :type', { type });
        }
        if (search) {
            queryBuilder.andWhere('(school.name LIKE :search OR school.city LIKE :search OR school.state LIKE :search)', { search: `%${search}%` });
        }
        const [schools, total] = await queryBuilder
            .orderBy('school.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        return {
            data: schools,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const school = await this.schoolRepository.findOne({
            where: { id },
        });
        if (!school) {
            throw new common_1.NotFoundException('School not found');
        }
        return school;
    }
    async findByUserId(userId) {
        const school = await this.schoolRepository.findOne({
            where: { userId: userId, isActive: 1 },
        });
        if (!school) {
            throw new common_1.NotFoundException('School not found for this user');
        }
        return school;
    }
    async create(createSchoolDto, userId) {
        const school = this.schoolRepository.create({
            ...createSchoolDto,
            status: school_entity_1.SchoolStatus.PENDING,
            isActive: 1,
            userId,
        });
        const savedSchool = await this.schoolRepository.save(school);
        return savedSchool;
    }
    async update(id, updateSchoolDto, userId) {
        const school = await this.findOne(id);
        Object.assign(school, updateSchoolDto);
        return this.schoolRepository.save(school);
    }
    async approveSchool(id, approvedById, comments) {
        const school = await this.findOne(id);
        if (school.status !== school_entity_1.SchoolStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending schools can be approved');
        }
        school.status = school_entity_1.SchoolStatus.APPROVED;
        school.approvedAt = new Date();
        school.approvedBy = approvedById;
        const approvedSchool = await this.schoolRepository.save(school);
        return approvedSchool;
    }
    async rejectSchool(id, rejectedById, reason) {
        const school = await this.findOne(id);
        if (school.status !== school_entity_1.SchoolStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending schools can be rejected');
        }
        school.status = school_entity_1.SchoolStatus.REJECTED;
        school.rejectionReason = reason;
        school.approvedBy = rejectedById;
        const rejectedSchool = await this.schoolRepository.save(school);
        return rejectedSchool;
    }
    async suspendSchool(id, suspendedById, reason) {
        const school = await this.findOne(id);
        if (school.status === school_entity_1.SchoolStatus.SUSPENDED) {
            throw new common_1.BadRequestException('School is already suspended');
        }
        school.status = school_entity_1.SchoolStatus.SUSPENDED;
        school.rejectionReason = reason;
        school.approvedBy = suspendedById;
        const suspendedSchool = await this.schoolRepository.save(school);
        return suspendedSchool;
    }
    async remove(id) {
        const school = await this.findOne(id);
        school.isActive = 0;
        school.status = school_entity_1.SchoolStatus.SUSPENDED;
        const deletedSchool = await this.schoolRepository.save(school);
        return {
            message: 'School has been successfully deleted (soft delete)',
            school: deletedSchool,
        };
    }
    async hardDelete(id) {
        const school = await this.findOne(id);
        await this.schoolRepository.remove(school);
    }
    async getPendingCount() {
        const count = await this.schoolRepository.count({
            where: { status: school_entity_1.SchoolStatus.PENDING },
        });
        return { count };
    }
    async getSchoolStats() {
        const [totalSchools, pendingSchools, approvedSchools, rejectedSchools, suspendedSchools,] = await Promise.all([
            this.schoolRepository.count(),
            this.schoolRepository.count({ where: { status: school_entity_1.SchoolStatus.PENDING } }),
            this.schoolRepository.count({ where: { status: school_entity_1.SchoolStatus.APPROVED } }),
            this.schoolRepository.count({ where: { status: school_entity_1.SchoolStatus.REJECTED } }),
            this.schoolRepository.count({ where: { status: school_entity_1.SchoolStatus.SUSPENDED } }),
        ]);
        return {
            total: totalSchools,
            pending: pendingSchools,
            approved: approvedSchools,
            rejected: rejectedSchools,
            suspended: suspendedSchools,
        };
    }
};
exports.SchoolsService = SchoolsService;
exports.SchoolsService = SchoolsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(school_entity_1.School)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SchoolsService);
//# sourceMappingURL=schools.service.js.map