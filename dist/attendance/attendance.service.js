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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_entity_1 = require("./entities/attendance.entity");
const class_entity_1 = require("../classes/entities/class.entity");
const user_entity_1 = require("../users/entities/user.entity");
let AttendanceService = class AttendanceService {
    constructor(attendanceRepository, classesRepository, usersRepository) {
        this.attendanceRepository = attendanceRepository;
        this.classesRepository = classesRepository;
        this.usersRepository = usersRepository;
    }
    async markAttendance(markAttendanceDto, teacherId) {
        try {
            console.log('=== MARK ATTENDANCE SERVICE ===');
            console.log('DTO:', JSON.stringify(markAttendanceDto, null, 2));
            console.log('Teacher/Admin ID:', teacherId);
            const classEntity = await this.classesRepository.findOne({
                where: { id: markAttendanceDto.classId }
            });
            if (!classEntity) {
                console.error('Class not found:', markAttendanceDto.classId);
                throw new common_1.NotFoundException('Class not found');
            }
            console.log('Class found:', classEntity.name);
            const attendanceRecords = [];
            const dateStr = markAttendanceDto.date;
            console.log('Date string:', dateStr);
            for (const studentAttendance of markAttendanceDto.attendance) {
                console.log('Processing student ID:', studentAttendance.studentId);
                const student = await this.usersRepository.findOne({
                    where: { id: studentAttendance.studentId, role: user_entity_1.UserRole.STUDENT }
                });
                if (!student) {
                    console.warn(`Student with userId ${studentAttendance.studentId} not found in users table, skipping...`);
                    continue;
                }
                console.log('Student found:', student.firstName, student.lastName);
                const existingAttendance = await this.attendanceRepository
                    .createQueryBuilder('attendance')
                    .where('attendance.studentId = :studentId', { studentId: studentAttendance.studentId })
                    .andWhere('attendance.classId = :classId', { classId: markAttendanceDto.classId })
                    .andWhere('DATE(attendance.date) = :date', { date: dateStr })
                    .getOne();
                if (existingAttendance) {
                    console.log('Updating existing attendance record:', existingAttendance.id);
                    existingAttendance.status = studentAttendance.status;
                    existingAttendance.remarks = studentAttendance.remarks;
                    existingAttendance.checkInTime = studentAttendance.checkInTime;
                    existingAttendance.mood = studentAttendance.mood;
                    existingAttendance.temperature = studentAttendance.temperature;
                    existingAttendance.teacherId = teacherId;
                    const saved = await this.attendanceRepository.save(existingAttendance);
                    console.log('Updated attendance record:', saved.id);
                    attendanceRecords.push(saved);
                }
                else {
                    console.log('Creating new attendance record');
                    const attendance = this.attendanceRepository.create({
                        studentId: studentAttendance.studentId,
                        classId: markAttendanceDto.classId,
                        teacherId: teacherId,
                        date: dateStr,
                        status: studentAttendance.status,
                        remarks: studentAttendance.remarks,
                        checkInTime: studentAttendance.checkInTime,
                        mood: studentAttendance.mood,
                        temperature: studentAttendance.temperature,
                        parentNotified: 0,
                    });
                    const saved = await this.attendanceRepository.save(attendance);
                    console.log('Created attendance record:', saved.id);
                    attendanceRecords.push(saved);
                }
            }
            console.log('Total attendance records processed:', attendanceRecords.length);
            return attendanceRecords;
        }
        catch (error) {
            console.error('=== ATTENDANCE SERVICE ERROR ===');
            console.error('Error:', error.message);
            console.error('Stack:', error.stack);
            throw error;
        }
    }
    async getAttendanceByClass(classId, date) {
        console.log('=== GET ATTENDANCE BY CLASS ===');
        console.log('classId:', classId);
        console.log('date:', date);
        let attendanceRecords;
        if (date) {
            attendanceRecords = await this.attendanceRepository
                .createQueryBuilder('attendance')
                .leftJoinAndSelect('attendance.student', 'student')
                .leftJoinAndSelect('attendance.teacher', 'teacher')
                .where('attendance.classId = :classId', { classId })
                .andWhere('DATE(attendance.date) = :date', { date })
                .orderBy('attendance.date', 'DESC')
                .addOrderBy('attendance.studentId', 'ASC')
                .getMany();
        }
        else {
            attendanceRecords = await this.attendanceRepository.find({
                where: { classId },
                relations: ['student', 'teacher'],
                order: { date: 'DESC', studentId: 'ASC' },
            });
        }
        console.log('Raw attendance records found:', attendanceRecords.length);
        console.log('Records:', attendanceRecords.map(r => ({ id: r.id, studentId: r.studentId, status: r.status, date: r.date })));
        const enhancedRecords = await Promise.all(attendanceRecords.map(async (record) => {
            const studentDetails = await this.attendanceRepository.manager.query(`SELECT enrollNumber, rollNumber FROM students WHERE userId = ? AND isActive = 1 LIMIT 1`, [record.studentId]);
            return {
                ...record,
                student: {
                    ...record.student,
                    enrollmentNumber: studentDetails[0]?.enrollNumber || null,
                    rollNumber: studentDetails[0]?.rollNumber || null,
                }
            };
        }));
        console.log('Enhanced records:', enhancedRecords.length);
        return enhancedRecords;
    }
    async getAttendanceByStudent(studentId, startDate, endDate) {
        const whereClause = { studentId };
        if (startDate && endDate) {
            whereClause.date = (0, typeorm_2.Between)(new Date(startDate), new Date(endDate));
        }
        return this.attendanceRepository.find({
            where: whereClause,
            relations: ['class', 'teacher'],
            order: { date: 'DESC' },
        });
    }
    async updateAttendance(id, updateAttendanceDto) {
        const attendance = await this.attendanceRepository.findOne({
            where: { id },
        });
        if (!attendance) {
            throw new common_1.NotFoundException('Attendance record not found');
        }
        Object.assign(attendance, updateAttendanceDto);
        return this.attendanceRepository.save(attendance);
    }
    async deleteAttendance(id) {
        const attendance = await this.attendanceRepository.findOne({
            where: { id },
        });
        if (!attendance) {
            throw new common_1.NotFoundException('Attendance record not found');
        }
        await this.attendanceRepository.remove(attendance);
    }
    async getAttendanceStats(classId, startDate, endDate) {
        const whereClause = { classId };
        if (startDate && endDate) {
            whereClause.date = (0, typeorm_2.Between)(new Date(startDate), new Date(endDate));
        }
        const attendanceRecords = await this.attendanceRepository.find({
            where: whereClause,
        });
        const result = {
            totalDays: 0,
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
            attendancePercentage: 0,
        };
        const uniqueDates = new Set(attendanceRecords.map(record => record.date.toISOString().split('T')[0]));
        result.totalDays = uniqueDates.size;
        attendanceRecords.forEach((record) => {
            if (record.status === attendance_entity_1.AttendanceStatus.PRESENT) {
                result.present++;
            }
            else if (record.status === attendance_entity_1.AttendanceStatus.ABSENT) {
                result.absent++;
            }
            else if (record.status === attendance_entity_1.AttendanceStatus.LATE) {
                result.late++;
            }
            else if (record.status === attendance_entity_1.AttendanceStatus.EXCUSED) {
                result.excused++;
            }
        });
        if (attendanceRecords.length > 0) {
            result.attendancePercentage = Math.round(((result.present + result.late) / attendanceRecords.length) * 100);
        }
        return result;
    }
    async getStudentAttendanceStats(studentId, startDate, endDate) {
        const whereClause = { studentId };
        if (startDate && endDate) {
            whereClause.date = (0, typeorm_2.Between)(new Date(startDate), new Date(endDate));
        }
        const attendanceRecords = await this.attendanceRepository.find({
            where: whereClause,
        });
        const result = {
            totalDays: attendanceRecords.length,
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
            attendancePercentage: 0,
        };
        attendanceRecords.forEach((record) => {
            if (record.status === attendance_entity_1.AttendanceStatus.PRESENT) {
                result.present++;
            }
            else if (record.status === attendance_entity_1.AttendanceStatus.ABSENT) {
                result.absent++;
            }
            else if (record.status === attendance_entity_1.AttendanceStatus.LATE) {
                result.late++;
            }
            else if (record.status === attendance_entity_1.AttendanceStatus.EXCUSED) {
                result.excused++;
            }
        });
        if (attendanceRecords.length > 0) {
            result.attendancePercentage = Math.round(((result.present + result.late) / attendanceRecords.length) * 100);
        }
        return result;
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __param(1, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map