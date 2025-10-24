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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const student_entity_1 = require("./entities/student.entity");
const class_entity_1 = require("../classes/entities/class.entity");
let StudentsService = class StudentsService {
    constructor(studentsRepository, usersRepository, classesRepository) {
        this.studentsRepository = studentsRepository;
        this.usersRepository = usersRepository;
        this.classesRepository = classesRepository;
    }
    async createStudent(createStudentDto, createdBy) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createStudentDto.email }
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        if (createStudentDto.enrollNumber && createStudentDto.classId) {
            const existingEnrollment = await this.studentsRepository.findOne({
                where: {
                    enrollNumber: createStudentDto.enrollNumber,
                    currentClassId: createStudentDto.classId,
                    isActive: 1
                }
            });
            if (existingEnrollment) {
                throw new common_1.ConflictException('Enrollment number already exists in this class');
            }
        }
        const user = this.usersRepository.create({
            firstName: createStudentDto.firstName,
            lastName: createStudentDto.lastName,
            email: createStudentDto.email,
            mobile: createStudentDto.mobile,
            password: createStudentDto.password,
            role: 'student',
            status: 'active',
            city: createStudentDto.city,
            state: createStudentDto.state,
            country: createStudentDto.country,
            postalCode: createStudentDto.postalCode,
            dateOfBirth: createStudentDto.dateOfBirth ? new Date(createStudentDto.dateOfBirth) : new Date('2000-01-01'),
            address: createStudentDto.address,
            emailVerified: 1,
            mobileVerified: 1,
        });
        const savedUser = await this.usersRepository.save(user);
        const studentId = `S${Date.now()}`;
        const rollNumber = `R${Date.now()}`;
        const admissionNumber = `ADM${Date.now()}`;
        const student = this.studentsRepository.create({
            userId: savedUser.id,
            schoolId: createStudentDto.schoolId,
            studentId: studentId,
            rollNumber: rollNumber,
            admissionNumber: admissionNumber,
            enrollNumber: createStudentDto.enrollNumber,
            dateOfBirth: createStudentDto.dateOfBirth ? new Date(createStudentDto.dateOfBirth) : new Date('2000-01-01'),
            gender: student_entity_1.Gender.OTHER,
            parentName: createStudentDto.parentName,
            parentPhone: createStudentDto.parentPhone,
            parentEmail: createStudentDto.parentEmail,
            emergencyContact: createStudentDto.emergencyContact,
            enrollmentDate: new Date(),
            currentClassId: createStudentDto.classId || null,
            previousSchool: createStudentDto.previousSchool,
            academicYear: new Date().getFullYear().toString(),
            status: student_entity_1.StudentStatus.ACTIVE,
            isActive: 1
        });
        return this.studentsRepository.save(student);
    }
    async findAll() {
        return this.studentsRepository.find({
            where: { isActive: 1 }
        });
    }
    async findBySchoolId(schoolId) {
        try {
            console.log('[Students Service] Finding students for schoolId:', schoolId);
            const students = await this.studentsRepository.find({
                where: {
                    schoolId: schoolId,
                    isActive: 1
                },
                order: { createdAt: 'DESC' }
            });
            console.log('[Students Service] Found', students.length, 'students');
            if (students.length === 0) {
                return [];
            }
            if (students.length > 0) {
                const testUserId = students[0].userId;
                console.log('[Students Service] Testing usersRepository with userId:', testUserId);
                const allUsers = await this.usersRepository.find({ take: 5 });
                console.log('[Students Service] Sample users in DB:', allUsers.map(u => ({ id: u.id, name: `${u.firstName} ${u.lastName}` })));
            }
            const studentsWithUserData = await Promise.all(students.map(async (student) => {
                try {
                    console.log('[Students Service] Fetching user for userId:', student.userId);
                    const user = await this.usersRepository.findOne({
                        where: { id: student.userId }
                    });
                    console.log('[Students Service] User found:', user ? `${user.firstName} ${user.lastName} (${user.email})` : 'NULL');
                    let className = null;
                    if (student.currentClassId) {
                        const classEntity = await this.classesRepository.findOne({
                            where: { id: student.currentClassId }
                        });
                        className = classEntity?.name || null;
                    }
                    return {
                        id: student.id,
                        userId: student.userId,
                        schoolId: student.schoolId,
                        studentId: student.studentId,
                        rollNumber: student.rollNumber,
                        admissionNumber: student.admissionNumber,
                        firstName: user?.firstName || '',
                        lastName: user?.lastName || '',
                        email: user?.email || '',
                        mobile: user?.mobile || '',
                        dateOfBirth: student.dateOfBirth,
                        gender: student.gender,
                        bloodGroup: student.bloodGroup,
                        parentName: student.parentName,
                        parentPhone: student.parentPhone,
                        parentEmail: student.parentEmail,
                        enrollmentDate: student.enrollmentDate,
                        currentClassId: student.currentClassId,
                        className: className,
                        academicYear: student.academicYear,
                        status: student.status,
                        isActive: student.isActive,
                        createdAt: student.createdAt,
                        updatedAt: student.updatedAt
                    };
                }
                catch (userError) {
                    console.error('[Students Service] Error fetching user for student', student.id, ':', userError.message);
                    return {
                        id: student.id,
                        userId: student.userId,
                        schoolId: student.schoolId,
                        studentId: student.studentId,
                        rollNumber: student.rollNumber,
                        admissionNumber: student.admissionNumber,
                        firstName: '',
                        lastName: '',
                        email: '',
                        mobile: '',
                        dateOfBirth: student.dateOfBirth,
                        gender: student.gender,
                        bloodGroup: student.bloodGroup,
                        parentName: student.parentName,
                        parentPhone: student.parentPhone,
                        parentEmail: student.parentEmail,
                        enrollmentDate: student.enrollmentDate,
                        currentClassId: student.currentClassId,
                        academicYear: student.academicYear,
                        status: student.status,
                        isActive: student.isActive,
                        createdAt: student.createdAt,
                        updatedAt: student.updatedAt
                    };
                }
            }));
            console.log('[Students Service] Returning', studentsWithUserData.length, 'students with user data');
            return studentsWithUserData;
        }
        catch (error) {
            console.error('[Students Service] Critical error in findBySchoolId:', error);
            throw error;
        }
    }
    async findByUserId(userId) {
        const student = await this.studentsRepository
            .createQueryBuilder('student')
            .leftJoinAndSelect('student.user', 'user')
            .leftJoinAndSelect('student.currentClass', 'currentClass')
            .leftJoinAndSelect('student.school', 'school')
            .where('student.userId = :userId', { userId })
            .andWhere('student.isActive = :isActive', { isActive: 1 })
            .getOne();
        if (!student) {
            throw new common_1.NotFoundException(`Student with user ID ${userId} not found`);
        }
        return {
            id: student.user.id,
            studentId: student.id,
            firstName: student.user.firstName,
            lastName: student.user.lastName,
            email: student.user.email,
            mobile: student.user.mobile,
            status: student.status,
            role: student.user.role,
            dateOfBirth: student.dateOfBirth,
            address: student.user.address,
            city: student.user.city,
            state: student.user.state,
            country: student.user.country,
            postalCode: student.user.postalCode,
            enrollNumber: student.enrollNumber,
            rollNumber: student.rollNumber,
            admissionNumber: student.admissionNumber,
            gender: student.gender,
            bloodGroup: student.bloodGroup,
            parentName: student.parentName,
            parentPhone: student.parentPhone,
            parentEmail: student.parentEmail,
            emergencyContact: student.emergencyContact,
            previousSchool: student.previousSchool,
            currentClassId: student.currentClassId,
            className: student.currentClass?.name,
            schoolId: student.schoolId,
            schoolName: student.school?.name,
            enrollmentDate: student.enrollmentDate,
            academicYear: student.academicYear,
            createdAt: student.createdAt,
            updatedAt: student.updatedAt,
        };
    }
    async findOne(id) {
        let student = await this.studentsRepository
            .createQueryBuilder('student')
            .leftJoinAndSelect('student.user', 'user')
            .leftJoinAndSelect('student.currentClass', 'currentClass')
            .leftJoinAndSelect('student.school', 'school')
            .where('user.id = :id', { id })
            .andWhere('student.isActive = :isActive', { isActive: 1 })
            .getOne();
        if (!student) {
            student = await this.studentsRepository
                .createQueryBuilder('student')
                .leftJoinAndSelect('student.user', 'user')
                .leftJoinAndSelect('student.currentClass', 'currentClass')
                .leftJoinAndSelect('student.school', 'school')
                .where('student.id = :id', { id })
                .andWhere('student.isActive = :isActive', { isActive: 1 })
                .getOne();
        }
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${id} not found`);
        }
        return {
            id: student.user.id,
            firstName: student.user.firstName,
            lastName: student.user.lastName,
            email: student.user.email,
            mobile: student.user.mobile,
            status: student.status,
            role: student.user.role,
            dateOfBirth: student.dateOfBirth,
            address: student.user.address,
            city: student.user.city,
            state: student.user.state,
            country: student.user.country,
            postalCode: student.user.postalCode,
            studentId: student.studentId,
            enrollNumber: student.enrollNumber,
            rollNumber: student.rollNumber,
            admissionNumber: student.admissionNumber,
            gender: student.gender,
            bloodGroup: student.bloodGroup,
            parentName: student.parentName,
            parentPhone: student.parentPhone,
            parentEmail: student.parentEmail,
            emergencyContact: student.emergencyContact,
            previousSchool: student.previousSchool,
            currentClassId: student.currentClassId,
            className: student.currentClass?.name,
            schoolId: student.schoolId,
            schoolName: student.school?.name,
            enrollmentDate: student.enrollmentDate,
            academicYear: student.academicYear,
            createdAt: student.createdAt,
            updatedAt: student.updatedAt,
        };
    }
    async update(id, updateStudentDto) {
        const student = await this.studentsRepository.findOne({
            where: { id, isActive: 1 },
            relations: ['user']
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${id} not found`);
        }
        if (updateStudentDto.enrollNumber || updateStudentDto.classId) {
            const newEnrollNumber = updateStudentDto.enrollNumber || student.enrollNumber;
            const newClassId = updateStudentDto.classId ? parseInt(updateStudentDto.classId) : student.currentClassId;
            if (newEnrollNumber && newClassId && (newEnrollNumber !== student.enrollNumber || newClassId !== student.currentClassId)) {
                const existingEnrollment = await this.studentsRepository.findOne({
                    where: {
                        enrollNumber: newEnrollNumber,
                        currentClassId: newClassId,
                        isActive: 1
                    }
                });
                if (existingEnrollment && existingEnrollment.id !== id) {
                    throw new common_1.ConflictException('Enrollment number already exists in this class');
                }
            }
        }
        if (updateStudentDto.gender)
            student.gender = updateStudentDto.gender;
        if (updateStudentDto.status)
            student.status = updateStudentDto.status;
        if (updateStudentDto.enrollNumber)
            student.enrollNumber = updateStudentDto.enrollNumber;
        if (updateStudentDto.parentName)
            student.parentName = updateStudentDto.parentName;
        if (updateStudentDto.parentPhone)
            student.parentPhone = updateStudentDto.parentPhone;
        if (updateStudentDto.parentEmail)
            student.parentEmail = updateStudentDto.parentEmail;
        if (updateStudentDto.emergencyContact)
            student.emergencyContact = updateStudentDto.emergencyContact;
        if (updateStudentDto.previousSchool)
            student.previousSchool = updateStudentDto.previousSchool;
        if (updateStudentDto.dateOfBirth)
            student.dateOfBirth = new Date(updateStudentDto.dateOfBirth);
        if (updateStudentDto.classId)
            student.currentClassId = parseInt(updateStudentDto.classId);
        if (updateStudentDto.firstName || updateStudentDto.lastName || updateStudentDto.email || updateStudentDto.mobile || updateStudentDto.address || updateStudentDto.city || updateStudentDto.state || updateStudentDto.country || updateStudentDto.postalCode) {
            const user = await this.usersRepository.findOne({ where: { id: student.userId } });
            if (user) {
                if (updateStudentDto.firstName)
                    user.firstName = updateStudentDto.firstName;
                if (updateStudentDto.lastName)
                    user.lastName = updateStudentDto.lastName;
                if (updateStudentDto.email)
                    user.email = updateStudentDto.email;
                if (updateStudentDto.mobile)
                    user.mobile = updateStudentDto.mobile;
                if (updateStudentDto.address)
                    user.address = updateStudentDto.address;
                if (updateStudentDto.city)
                    user.city = updateStudentDto.city;
                if (updateStudentDto.state)
                    user.state = updateStudentDto.state;
                if (updateStudentDto.country)
                    user.country = updateStudentDto.country;
                if (updateStudentDto.postalCode)
                    user.postalCode = updateStudentDto.postalCode;
                await this.usersRepository.save(user);
            }
        }
        await this.studentsRepository.save(student);
        return this.findOne(id);
    }
    async remove(id) {
        const student = await this.studentsRepository.findOne({
            where: { id, isActive: 1 }
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${id} not found`);
        }
        student.isActive = 0;
        await this.studentsRepository.save(student);
    }
    async updateStatus(id, status) {
        const student = await this.studentsRepository.findOne({
            where: { id, isActive: 1 }
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${id} not found`);
        }
        student.status = status;
        return this.studentsRepository.save(student);
    }
    async findBySchool(schoolId) {
        return this.findBySchoolId(schoolId);
    }
    async findByClass(classId) {
        const students = await this.studentsRepository.find({
            where: {
                currentClassId: classId,
                isActive: 1
            },
            order: { createdAt: 'DESC' }
        });
        const studentsWithUserData = await Promise.all(students.map(async (student) => {
            const user = await this.usersRepository.findOne({
                where: { id: student.userId }
            });
            return {
                id: student.id,
                userId: student.userId,
                schoolId: student.schoolId,
                studentId: student.studentId,
                rollNumber: student.rollNumber,
                admissionNumber: student.admissionNumber,
                enrollNumber: student.enrollNumber,
                enrollmentNumber: student.enrollNumber,
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                mobile: user?.mobile || '',
                dateOfBirth: student.dateOfBirth,
                gender: student.gender,
                bloodGroup: student.bloodGroup,
                parentName: student.parentName,
                parentPhone: student.parentPhone,
                parentEmail: student.parentEmail,
                enrollmentDate: student.enrollmentDate,
                currentClassId: student.currentClassId,
                academicYear: student.academicYear,
                status: student.status,
                isActive: student.isActive,
                createdAt: student.createdAt,
                updatedAt: student.updatedAt
            };
        }));
        return studentsWithUserData;
    }
    async resetPassword(studentId, newPassword) {
        const student = await this.studentsRepository.findOne({
            where: { id: parseInt(studentId), isActive: 1 },
            relations: ['user']
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const user = student.user;
        if (!user) {
            throw new common_1.NotFoundException('User not found for this student');
        }
        console.log('Resetting password for student:', {
            studentId: student.id,
            userId: user.id,
            email: user.email
        });
        user.password = newPassword;
        await this.usersRepository.save(user);
        console.log('✅ Password reset successfully for student:', user.email);
        return {
            success: true,
            message: 'Password reset successfully',
            studentId: student.id,
            userId: user.id,
            email: user.email
        };
    }
    async exportToCSV(schoolId) {
        try {
            console.log('[Students Service] Exporting students for schoolId:', schoolId);
            const students = await this.findBySchoolId(schoolId);
            if (students.length === 0) {
                return 'No students found to export';
            }
            const headers = [
                'Student ID',
                'Roll Number',
                'Admission Number',
                'Enrollment Number',
                'First Name',
                'Last Name',
                'Email',
                'Mobile',
                'Date of Birth',
                'Gender',
                'Blood Group',
                'Current Class',
                'Status',
                'Parent Name',
                'Parent Phone',
                'Parent Email',
                'Emergency Contact',
                'Enrollment Date',
                'Academic Year',
                'Previous School'
            ];
            const rows = students.map(student => [
                this.escapeCSV(student.studentId || ''),
                this.escapeCSV(student.rollNumber || ''),
                this.escapeCSV(student.admissionNumber || ''),
                this.escapeCSV(student.enrollNumber || ''),
                this.escapeCSV(student.firstName || ''),
                this.escapeCSV(student.lastName || ''),
                this.escapeCSV(student.email || ''),
                this.escapeCSV(student.mobile || ''),
                student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '',
                this.escapeCSV(student.gender || ''),
                this.escapeCSV(student.bloodGroup || ''),
                this.escapeCSV(student.className || ''),
                this.escapeCSV(student.status || ''),
                this.escapeCSV(student.parentName || ''),
                this.escapeCSV(student.parentPhone || ''),
                this.escapeCSV(student.parentEmail || ''),
                this.escapeCSV(student.emergencyContact || ''),
                student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : '',
                this.escapeCSV(student.academicYear || ''),
                this.escapeCSV(student.previousSchool || '')
            ].join(','));
            const csv = [headers.join(','), ...rows].join('\n');
            console.log('[Students Service] CSV generated successfully with', students.length, 'students');
            return csv;
        }
        catch (error) {
            console.error('[Students Service] Error in exportToCSV:', error);
            throw error;
        }
    }
    escapeCSV(value) {
        if (value === null || value === undefined) {
            return '';
        }
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StudentsService);
//# sourceMappingURL=students.service.js.map