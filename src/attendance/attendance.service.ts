import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { Class } from '../classes/entities/class.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Class)
    private classesRepository: Repository<Class>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async markAttendance(markAttendanceDto: MarkAttendanceDto, teacherId: number): Promise<Attendance[]> {
    try {
      console.log('=== MARK ATTENDANCE SERVICE ===');
      console.log('DTO:', JSON.stringify(markAttendanceDto, null, 2));
      console.log('Teacher/Admin ID:', teacherId);

      // Check if class exists
      const classEntity = await this.classesRepository.findOne({ 
        where: { id: markAttendanceDto.classId } 
      });
      
      if (!classEntity) {
        console.error('Class not found:', markAttendanceDto.classId);
        throw new NotFoundException('Class not found');
      }

      console.log('Class found:', classEntity.name);

      const attendanceRecords: Attendance[] = [];
      
      // Parse date properly for MySQL date format (YYYY-MM-DD)
      const dateStr = markAttendanceDto.date;
      console.log('Date string:', dateStr);

      for (const studentAttendance of markAttendanceDto.attendance) {
        console.log('Processing student ID:', studentAttendance.studentId);
        
        // Check if student exists
        const student = await this.usersRepository.findOne({ 
          where: { id: studentAttendance.studentId, role: UserRole.STUDENT } 
        });
        
        if (!student) {
          console.warn(`Student with userId ${studentAttendance.studentId} not found in users table, skipping...`);
          continue;
        }

        console.log('Student found:', student.firstName, student.lastName);

        // Check if attendance already exists for this date (use date string for comparison)
        const existingAttendance = await this.attendanceRepository
          .createQueryBuilder('attendance')
          .where('attendance.studentId = :studentId', { studentId: studentAttendance.studentId })
          .andWhere('attendance.classId = :classId', { classId: markAttendanceDto.classId })
          .andWhere('DATE(attendance.date) = :date', { date: dateStr })
          .getOne();

        if (existingAttendance) {
          console.log('Updating existing attendance record:', existingAttendance.id);
          // Update existing attendance
          existingAttendance.status = studentAttendance.status as AttendanceStatus;
          existingAttendance.remarks = studentAttendance.remarks;
          existingAttendance.checkInTime = studentAttendance.checkInTime;
          existingAttendance.mood = studentAttendance.mood;
          existingAttendance.temperature = studentAttendance.temperature;
          existingAttendance.teacherId = teacherId;
          
          const saved = await this.attendanceRepository.save(existingAttendance);
          console.log('Updated attendance record:', saved.id);
          attendanceRecords.push(saved);
        } else {
          console.log('Creating new attendance record');
          // Create new attendance record
          const attendance = this.attendanceRepository.create({
            studentId: studentAttendance.studentId,
            classId: markAttendanceDto.classId,
            teacherId: teacherId,
            date: dateStr as any, // Use date string directly
            status: studentAttendance.status as AttendanceStatus,
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
    } catch (error) {
      console.error('=== ATTENDANCE SERVICE ERROR ===');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      throw error;
    }
  }

  async getAttendanceByClass(classId: number, date?: string): Promise<any[]> {
    console.log('=== GET ATTENDANCE BY CLASS ===');
    console.log('classId:', classId);
    console.log('date:', date);

    let attendanceRecords;

    if (date) {
      // Use DATE() function for proper date comparison
      attendanceRecords = await this.attendanceRepository
        .createQueryBuilder('attendance')
        .leftJoinAndSelect('attendance.student', 'student')
        .leftJoinAndSelect('attendance.teacher', 'teacher')
        .where('attendance.classId = :classId', { classId })
        .andWhere('DATE(attendance.date) = :date', { date })
        .orderBy('attendance.date', 'DESC')
        .addOrderBy('attendance.studentId', 'ASC')
        .getMany();
    } else {
      attendanceRecords = await this.attendanceRepository.find({
        where: { classId },
        relations: ['student', 'teacher'],
        order: { date: 'DESC', studentId: 'ASC' },
      });
    }

    console.log('Raw attendance records found:', attendanceRecords.length);
    console.log('Records:', attendanceRecords.map(r => ({ id: r.id, studentId: r.studentId, status: r.status, date: r.date })));

    // Enhance with student details from students table
    const enhancedRecords = await Promise.all(
      attendanceRecords.map(async (record) => {
        // Get additional student details from students table
        const studentDetails = await this.attendanceRepository.manager.query(
          `SELECT enrollNumber, rollNumber FROM students WHERE userId = ? AND isActive = 1 LIMIT 1`,
          [record.studentId]
        );

        return {
          ...record,
          student: {
            ...record.student,
            enrollmentNumber: studentDetails[0]?.enrollNumber || null,
            rollNumber: studentDetails[0]?.rollNumber || null,
          }
        };
      })
    );

    console.log('Enhanced records:', enhancedRecords.length);
    return enhancedRecords;
  }

  async getAttendanceByStudent(studentId: number, startDate?: string, endDate?: string): Promise<Attendance[]> {
    const whereClause: any = { studentId };

    if (startDate && endDate) {
      whereClause.date = Between(new Date(startDate), new Date(endDate));
    }

    return this.attendanceRepository.find({
      where: whereClause,
      relations: ['class', 'teacher'],
      order: { date: 'DESC' },
    });
  }

  async updateAttendance(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    Object.assign(attendance, updateAttendanceDto);
    return this.attendanceRepository.save(attendance);
  }

  async deleteAttendance(id: number): Promise<void> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    await this.attendanceRepository.remove(attendance);
  }

  async getAttendanceStats(classId: number, startDate?: string, endDate?: string): Promise<{
    totalDays: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendancePercentage: number;
  }> {
    const whereClause: any = { classId };

    if (startDate && endDate) {
      whereClause.date = Between(new Date(startDate), new Date(endDate));
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

    // Group by date to count unique days
    const uniqueDates = new Set(attendanceRecords.map(record => record.date.toISOString().split('T')[0]));
    result.totalDays = uniqueDates.size;

    attendanceRecords.forEach((record) => {
      if (record.status === AttendanceStatus.PRESENT) {
        result.present++;
      } else if (record.status === AttendanceStatus.ABSENT) {
        result.absent++;
      } else if (record.status === AttendanceStatus.LATE) {
        result.late++;
      } else if (record.status === AttendanceStatus.EXCUSED) {
        result.excused++;
      }
    });

    if (attendanceRecords.length > 0) {
      result.attendancePercentage = Math.round(
        ((result.present + result.late) / attendanceRecords.length) * 100
      );
    }

    return result;
  }

  async getStudentAttendanceStats(studentId: number, startDate?: string, endDate?: string): Promise<{
    totalDays: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendancePercentage: number;
  }> {
    const whereClause: any = { studentId };

    if (startDate && endDate) {
      whereClause.date = Between(new Date(startDate), new Date(endDate));
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
      if (record.status === AttendanceStatus.PRESENT) {
        result.present++;
      } else if (record.status === AttendanceStatus.ABSENT) {
        result.absent++;
      } else if (record.status === AttendanceStatus.LATE) {
        result.late++;
      } else if (record.status === AttendanceStatus.EXCUSED) {
        result.excused++;
      }
    });

    if (attendanceRecords.length > 0) {
      result.attendancePercentage = Math.round(
        ((result.present + result.late) / attendanceRecords.length) * 100
      );
    }

    return result;
  }
}

