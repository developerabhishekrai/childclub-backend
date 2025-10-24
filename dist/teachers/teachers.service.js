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
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const school_entity_1 = require("../schools/entities/school.entity");
const class_entity_1 = require("../classes/entities/class.entity");
const teacher_entity_1 = require("./entities/teacher.entity");
const teacher_class_entity_1 = require("./entities/teacher-class.entity");
const subject_entity_1 = require("../subjects/entities/subject.entity");
let TeachersService = class TeachersService {
    constructor(usersRepository, schoolsRepository, classesRepository, teachersRepository, teacherClassesRepository, subjectsRepository) {
        this.usersRepository = usersRepository;
        this.schoolsRepository = schoolsRepository;
        this.classesRepository = classesRepository;
        this.teachersRepository = teachersRepository;
        this.teacherClassesRepository = teacherClassesRepository;
        this.subjectsRepository = subjectsRepository;
    }
    async createTeacher(createTeacherDto, createdBy) {
        const school = await this.schoolsRepository.findOne({ where: { id: parseInt(createTeacherDto.schoolId) } });
        if (!school) {
            throw new common_1.NotFoundException('School not found');
        }
        const existingUser = await this.usersRepository.findOne({ where: { email: createTeacherDto.email } });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already exists');
        }
        const user = this.usersRepository.create({
            firstName: createTeacherDto.firstName,
            lastName: createTeacherDto.lastName,
            email: createTeacherDto.email,
            mobile: createTeacherDto.mobile,
            password: createTeacherDto.password,
            role: user_entity_1.UserRole.TEACHER,
            status: user_entity_1.UserStatus.ACTIVE,
            city: createTeacherDto.city,
            state: createTeacherDto.state,
            country: createTeacherDto.country,
            postalCode: createTeacherDto.postalCode,
            address: createTeacherDto.address,
            dateOfBirth: createTeacherDto.dateOfBirth,
        });
        const savedUser = await this.usersRepository.save(user);
        const employeeId = `TCH${Date.now().toString().slice(-8)}`;
        const teacher = this.teachersRepository.create({
            userId: savedUser.id,
            schoolId: parseInt(createTeacherDto.schoolId),
            employeeId: employeeId,
            qualification: createTeacherDto.qualification || '',
            specialization: createTeacherDto.specialization || '',
            experienceYears: createTeacherDto.experienceYears || 0,
            department: createTeacherDto.department || '',
            designation: createTeacherDto.designation || '',
            joiningDate: createTeacherDto.joiningDate || new Date(),
            salary: createTeacherDto.salary || null,
            emergencyContact: createTeacherDto.emergencyContact || '',
            subjects: createTeacherDto.subjects || [],
            status: teacher_entity_1.TeacherStatus.ACTIVE,
            isActive: 1,
        });
        await this.teachersRepository.save(teacher);
        if (createTeacherDto.classIds && createTeacherDto.classIds.length > 0) {
            const teacherClasses = createTeacherDto.classIds.map((classId, index) => {
                return this.teacherClassesRepository.create({
                    teacherId: teacher.id,
                    classId: classId,
                    isPrimary: index === 0 ? 1 : 0,
                    isActive: 1,
                });
            });
            await this.teacherClassesRepository.save(teacherClasses);
            console.log('Teacher classes assigned:', {
                teacherId: teacher.id,
                classIds: createTeacherDto.classIds
            });
        }
        console.log('Teacher created successfully:', {
            userId: savedUser.id,
            teacherId: teacher.id,
            schoolId: teacher.schoolId,
            employeeId: teacher.employeeId
        });
        return {
            ...savedUser,
            teacherId: teacher.id,
            employeeId: teacher.employeeId,
            schoolId: teacher.schoolId
        };
    }
    async findAllTeachers(userId) {
        const school = await this.schoolsRepository.findOne({
            where: { userId: parseInt(userId) }
        });
        if (!school) {
            console.log('No school found for userId:', userId);
            return [];
        }
        console.log('Finding teachers for schoolId:', school.id);
        const teachers = await this.teachersRepository
            .createQueryBuilder('teacher')
            .leftJoinAndSelect('teacher.user', 'user')
            .where('teacher.schoolId = :schoolId', { schoolId: school.id })
            .andWhere('teacher.isActive = :isActive', { isActive: 1 })
            .andWhere('user.status != :inactiveStatus', { inactiveStatus: user_entity_1.UserStatus.INACTIVE })
            .orderBy('teacher.createdAt', 'DESC')
            .getMany();
        console.log('Found teachers:', teachers.length);
        return teachers.map(teacher => ({
            id: teacher.user.id,
            firstName: teacher.user.firstName,
            lastName: teacher.user.lastName,
            email: teacher.user.email,
            mobile: teacher.user.mobile,
            status: teacher.user.status,
            role: teacher.user.role,
            city: teacher.user.city,
            state: teacher.user.state,
            country: teacher.user.country,
            createdAt: teacher.user.createdAt,
            updatedAt: teacher.user.updatedAt,
            teacherId: teacher.id,
            employeeId: teacher.employeeId,
            schoolId: teacher.schoolId,
            qualification: teacher.qualification,
            experienceYears: teacher.experienceYears,
            joiningDate: teacher.joiningDate,
            department: teacher.department,
            designation: teacher.designation,
            subjects: teacher.subjects || [],
        }));
    }
    async findTeacherById(id) {
        const teacher = await this.teachersRepository
            .createQueryBuilder('teacher')
            .leftJoinAndSelect('teacher.user', 'user')
            .leftJoinAndSelect('teacher.school', 'school')
            .where('user.id = :id', { id: parseInt(id) })
            .andWhere('user.role = :role', { role: user_entity_1.UserRole.TEACHER })
            .getOne();
        if (!teacher) {
            throw new common_1.NotFoundException('Teacher not found');
        }
        return {
            id: teacher.user.id,
            firstName: teacher.user.firstName,
            lastName: teacher.user.lastName,
            email: teacher.user.email,
            mobile: teacher.user.mobile,
            status: teacher.user.status,
            role: teacher.user.role,
            city: teacher.user.city,
            state: teacher.user.state,
            country: teacher.user.country,
            postalCode: teacher.user.postalCode,
            address: teacher.user.address,
            dateOfBirth: teacher.user.dateOfBirth,
            createdAt: teacher.user.createdAt,
            updatedAt: teacher.user.updatedAt,
            teacherId: teacher.id,
            employeeId: teacher.employeeId,
            schoolId: teacher.schoolId,
            schoolName: teacher.school?.name || '',
            qualification: teacher.qualification,
            specialization: teacher.specialization,
            experienceYears: teacher.experienceYears,
            joiningDate: teacher.joiningDate,
            department: teacher.department,
            designation: teacher.designation,
            salary: teacher.salary,
            emergencyContact: teacher.emergencyContact,
            subjects: teacher.subjects || [],
            classId: teacher.classId,
        };
    }
    async updateTeacher(id, updateTeacherDto) {
        const teacherRecord = await this.teachersRepository
            .createQueryBuilder('teacher')
            .leftJoinAndSelect('teacher.user', 'user')
            .where('user.id = :id', { id: parseInt(id) })
            .andWhere('user.role = :role', { role: user_entity_1.UserRole.TEACHER })
            .getOne();
        if (!teacherRecord) {
            throw new common_1.NotFoundException('Teacher not found');
        }
        const userUpdateData = {};
        if (updateTeacherDto.firstName)
            userUpdateData.firstName = updateTeacherDto.firstName;
        if (updateTeacherDto.lastName)
            userUpdateData.lastName = updateTeacherDto.lastName;
        if (updateTeacherDto.email)
            userUpdateData.email = updateTeacherDto.email;
        if (updateTeacherDto.mobile)
            userUpdateData.mobile = updateTeacherDto.mobile;
        if (updateTeacherDto.dateOfBirth)
            userUpdateData.dateOfBirth = new Date(updateTeacherDto.dateOfBirth);
        if (updateTeacherDto.address)
            userUpdateData.address = updateTeacherDto.address;
        if (updateTeacherDto.city)
            userUpdateData.city = updateTeacherDto.city;
        if (updateTeacherDto.state)
            userUpdateData.state = updateTeacherDto.state;
        if (updateTeacherDto.country)
            userUpdateData.country = updateTeacherDto.country;
        if (updateTeacherDto.postalCode)
            userUpdateData.postalCode = updateTeacherDto.postalCode;
        Object.assign(teacherRecord.user, userUpdateData);
        await this.usersRepository.save(teacherRecord.user);
        const teacherUpdateData = {};
        if (updateTeacherDto.qualification !== undefined)
            teacherUpdateData.qualification = updateTeacherDto.qualification;
        if (updateTeacherDto.specialization !== undefined)
            teacherUpdateData.specialization = updateTeacherDto.specialization;
        if (updateTeacherDto.experienceYears !== undefined)
            teacherUpdateData.experienceYears = parseInt(updateTeacherDto.experienceYears);
        if (updateTeacherDto.department !== undefined)
            teacherUpdateData.department = updateTeacherDto.department;
        if (updateTeacherDto.designation !== undefined)
            teacherUpdateData.designation = updateTeacherDto.designation;
        if (updateTeacherDto.emergencyContact !== undefined)
            teacherUpdateData.emergencyContact = updateTeacherDto.emergencyContact;
        if (updateTeacherDto.joiningDate)
            teacherUpdateData.joiningDate = new Date(updateTeacherDto.joiningDate);
        if (updateTeacherDto.salary !== undefined) {
            teacherUpdateData.salary = updateTeacherDto.salary ? parseFloat(String(updateTeacherDto.salary)) : null;
        }
        if (updateTeacherDto.subjects)
            teacherUpdateData.subjects = updateTeacherDto.subjects;
        if (updateTeacherDto.status)
            teacherUpdateData.status = updateTeacherDto.status;
        if (updateTeacherDto.classId !== undefined) {
            teacherUpdateData.classId = updateTeacherDto.classId ? parseInt(updateTeacherDto.classId) : null;
        }
        Object.assign(teacherRecord, teacherUpdateData);
        await this.teachersRepository.save(teacherRecord);
        if (updateTeacherDto.classIds !== undefined) {
            await this.teacherClassesRepository.delete({ teacherId: teacherRecord.id });
            if (updateTeacherDto.classIds && updateTeacherDto.classIds.length > 0) {
                const teacherClasses = updateTeacherDto.classIds.map((classId, index) => {
                    return this.teacherClassesRepository.create({
                        teacherId: teacherRecord.id,
                        classId: classId,
                        isPrimary: index === 0 ? 1 : 0,
                        isActive: 1,
                    });
                });
                await this.teacherClassesRepository.save(teacherClasses);
                console.log('Teacher classes updated:', {
                    teacherId: teacherRecord.id,
                    classIds: updateTeacherDto.classIds
                });
            }
        }
        return this.findTeacherById(id);
    }
    async deleteTeacher(id) {
        try {
            const user = await this.usersRepository.findOne({
                where: { id: parseInt(id), role: user_entity_1.UserRole.TEACHER }
            });
            if (!user) {
                throw new common_1.NotFoundException('Teacher not found');
            }
            console.log('Deleting teacher:', { userId: user.id, email: user.email });
            const teacherRecord = await this.teachersRepository.findOne({
                where: { userId: user.id }
            });
            if (teacherRecord) {
                teacherRecord.isActive = 0;
                await this.teachersRepository.save(teacherRecord);
                console.log('Teacher record soft deleted:', teacherRecord.id);
            }
            user.status = user_entity_1.UserStatus.INACTIVE;
            await this.usersRepository.save(user);
            console.log('User record soft deleted:', user.id);
        }
        catch (error) {
            console.error('Error deleting teacher:', error);
            throw error;
        }
    }
    async getTeachersByClass(classId) {
        return this.usersRepository
            .createQueryBuilder('user')
            .innerJoin('class_teachers', 'ct', 'ct.teacherId = user.id')
            .where('ct.classId = :classId', { classId })
            .andWhere('user.role = :role', { role: user_entity_1.UserRole.TEACHER })
            .getMany();
    }
    async getTeacherStats(userId) {
        const school = await this.schoolsRepository.findOne({
            where: { userId: parseInt(userId) }
        });
        if (!school) {
            return {
                total: 0,
                active: 0,
                inactive: 0,
                pending: 0,
            };
        }
        const stats = await this.teachersRepository
            .createQueryBuilder('teacher')
            .leftJoin('teacher.user', 'user')
            .select('user.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .where('teacher.schoolId = :schoolId', { schoolId: school.id })
            .andWhere('teacher.isActive = :isActive', { isActive: 1 })
            .groupBy('user.status')
            .getRawMany();
        const result = {
            total: 0,
            active: 0,
            inactive: 0,
            pending: 0,
        };
        stats.forEach((stat) => {
            const count = parseInt(stat.count);
            result.total += count;
            result[stat.status] = count;
        });
        return result;
    }
    async assignTeacherToClass(teacherId, classId) {
        const teacher = await this.findTeacherById(teacherId);
        const classEntity = await this.classesRepository.findOne({ where: { id: parseInt(classId) } });
        if (!classEntity) {
            throw new common_1.NotFoundException('Class not found');
        }
        await this.usersRepository
            .createQueryBuilder()
            .insert()
            .into('class_teachers')
            .values({ classId, teacherId })
            .execute();
    }
    async removeTeacherFromClass(teacherId, classId) {
        await this.usersRepository
            .createQueryBuilder()
            .delete()
            .from('class_teachers')
            .where('classId = :classId AND teacherId = :teacherId', { classId, teacherId })
            .execute();
    }
    async resetPassword(teacherId, newPassword) {
        const user = await this.usersRepository.findOne({
            where: { id: parseInt(teacherId), role: user_entity_1.UserRole.TEACHER }
        });
        if (!user) {
            throw new common_1.NotFoundException('Teacher not found');
        }
        console.log('Resetting password for teacher:', { userId: user.id, email: user.email });
        user.password = newPassword;
        await this.usersRepository.save(user);
        console.log('✅ Password reset successfully for teacher:', user.email);
        return {
            success: true,
            message: 'Password reset successfully',
            teacherId: user.id,
            email: user.email
        };
    }
    async getTeacherClasses(userId) {
        console.log('[Teachers Service] getTeacherClasses called for userId:', userId);
        console.log('[Teachers Service] userId type:', typeof userId);
        if (userId === null || userId === undefined || Number.isNaN(userId) || userId <= 0) {
            console.error('[Teachers Service] Invalid userId:', userId);
            console.error('[Teachers Service] userId is null/undefined/NaN, returning empty array');
            return [];
        }
        const validUserId = Number(userId);
        if (isNaN(validUserId) || validUserId <= 0) {
            console.error('[Teachers Service] userId cannot be converted to valid number:', userId);
            return [];
        }
        console.log('[Teachers Service] Using valid userId:', validUserId);
        try {
            const teacherRecord = await this.teachersRepository
                .createQueryBuilder('teacher')
                .leftJoinAndSelect('teacher.user', 'user')
                .where('user.id = :userId', { userId: validUserId })
                .andWhere('user.role = :role', { role: user_entity_1.UserRole.TEACHER })
                .getOne();
            if (!teacherRecord) {
                console.log('[Teachers Service] Teacher not found for userId:', userId);
                console.log('[Teachers Service] Available teachers:', await this.teachersRepository.find());
                throw new common_1.NotFoundException('Teacher not found');
            }
            console.log('[Teachers Service] Teacher found:', {
                teacherId: teacherRecord.id,
                schoolId: teacherRecord.schoolId,
                userId: teacherRecord.userId
            });
            const teacherClasses = await this.teacherClassesRepository
                .createQueryBuilder('tc')
                .leftJoinAndSelect('tc.class', 'class')
                .where('tc.teacherId = :teacherId', { teacherId: teacherRecord.id })
                .andWhere('tc.isActive = :isActive', { isActive: 1 })
                .getMany();
            console.log('[Teachers Service] Raw teacher classes query result:', teacherClasses);
            console.log('[Teachers Service] Found', teacherClasses.length, 'classes');
            if (teacherClasses.length === 0) {
                console.log('[Teachers Service] No classes assigned to teacher');
                return [];
            }
            const result = teacherClasses
                .filter(tc => tc.class)
                .map(tc => ({
                id: tc.classId,
                name: tc.class.name,
                grade: tc.class.grade,
                section: tc.class.section,
                isPrimary: tc.isPrimary === 1,
            }));
            console.log('[Teachers Service] Processed result:', result);
            return result;
        }
        catch (error) {
            console.error('[Teachers Service] Error in getTeacherClasses:', error);
            console.error('[Teachers Service] Error stack:', error.stack);
            console.log('[Teachers Service] Returning empty array due to error');
            return [];
        }
    }
    async getMyStudents(userId) {
        console.log('[Teachers Service] getMyStudents called for userId:', userId);
        const teacherRecord = await this.teachersRepository
            .createQueryBuilder('teacher')
            .leftJoinAndSelect('teacher.user', 'user')
            .where('user.id = :userId', { userId })
            .andWhere('user.role = :role', { role: user_entity_1.UserRole.TEACHER })
            .getOne();
        if (!teacherRecord) {
            console.log('[Teachers Service] Teacher not found for userId:', userId);
            throw new common_1.NotFoundException('Teacher not found');
        }
        console.log('[Teachers Service] Teacher found:', {
            teacherId: teacherRecord.id,
            schoolId: teacherRecord.schoolId
        });
        const teacherClasses = await this.teacherClassesRepository
            .createQueryBuilder('tc')
            .leftJoinAndSelect('tc.class', 'class')
            .where('tc.teacherId = :teacherId', { teacherId: teacherRecord.id })
            .andWhere('tc.isActive = :isActive', { isActive: 1 })
            .orderBy('tc.isPrimary', 'DESC')
            .getMany();
        console.log('[Teachers Service] Teacher has', teacherClasses.length, 'assigned classes');
        if (teacherClasses.length === 0) {
            console.log('[Teachers Service] Teacher has no assigned classes');
            return {
                classId: null,
                className: null,
                classes: [],
                students: []
            };
        }
        const classIds = teacherClasses.map(tc => tc.classId);
        console.log('[Teachers Service] Fetching students for classIds:', classIds, 'and schoolId:', teacherRecord.schoolId);
        const students = await this.usersRepository
            .createQueryBuilder('user')
            .leftJoin('students', 'student', 'student.userId = user.id')
            .leftJoin('classes', 'class', 'class.id = student.currentClassId')
            .where('student.currentClassId IN (:...classIds)', { classIds })
            .andWhere('student.schoolId = :schoolId', { schoolId: teacherRecord.schoolId })
            .andWhere('student.isActive = :isActive', { isActive: 1 })
            .select([
            'user.id as userId',
            'user.firstName as firstName',
            'user.lastName as lastName',
            'user.email as email',
            'user.mobile as mobile',
            'student.id as studentRecordId',
            'student.studentId as studentCode',
            'student.enrollNumber as enrollNumber',
            'student.rollNumber as rollNumber',
            'student.admissionNumber as admissionNumber',
            'student.dateOfBirth as dateOfBirth',
            'student.gender as gender',
            'student.bloodGroup as bloodGroup',
            'student.parentName as parentName',
            'student.parentPhone as parentPhone',
            'student.parentEmail as parentEmail',
            'student.emergencyContact as emergencyContact',
            'student.previousSchool as previousSchool',
            'student.enrollmentDate as enrollmentDate',
            'student.status as status',
            'student.currentClassId as currentClassId',
            'class.name as className',
            'class.grade as classGrade',
            'class.section as classSection'
        ])
            .orderBy('class.grade', 'ASC')
            .addOrderBy('class.section', 'ASC')
            .addOrderBy('student.rollNumber', 'ASC')
            .getRawMany();
        console.log('[Teachers Service] Found', students.length, 'students across all classes');
        const primaryClass = teacherClasses[0];
        return {
            classId: primaryClass.classId,
            className: primaryClass.class.name,
            classes: teacherClasses.map(tc => ({
                id: tc.classId,
                name: tc.class.name,
                grade: tc.class.grade,
                section: tc.class.section,
                isPrimary: tc.isPrimary === 1
            })),
            students: students.map(s => ({
                id: s.userId,
                firstName: s.firstName,
                lastName: s.lastName,
                email: s.email,
                mobile: s.mobile,
                studentId: s.studentRecordId,
                studentCode: s.studentCode,
                enrollNumber: s.enrollNumber,
                rollNumber: s.rollNumber,
                admissionNumber: s.admissionNumber,
                dateOfBirth: s.dateOfBirth,
                gender: s.gender,
                bloodGroup: s.bloodGroup,
                parentName: s.parentName,
                parentPhone: s.parentPhone,
                parentEmail: s.parentEmail,
                emergencyContact: s.emergencyContact,
                previousSchool: s.previousSchool,
                enrollmentDate: s.enrollmentDate,
                status: s.status,
                currentClassId: s.currentClassId,
                className: s.className,
                classGrade: s.classGrade,
                classSection: s.classSection
            }))
        };
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(school_entity_1.School)),
    __param(2, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(3, (0, typeorm_1.InjectRepository)(teacher_entity_1.Teacher)),
    __param(4, (0, typeorm_1.InjectRepository)(teacher_class_entity_1.TeacherClass)),
    __param(5, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map