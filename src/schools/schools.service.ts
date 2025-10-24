import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { School, SchoolStatus, SchoolType } from './entities/school.entity';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

interface FindAllOptions {
  status?: string;
  type?: string;
  search?: string;
  page: number;
  limit: number;
  userRole?: string;
  schoolId?: number;
}

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
  ) {}

  async findAll(options: FindAllOptions) {
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
      .where('school.isActive = :isActive', { isActive: 1 }); // Only show active schools

    // Add role-based filtering
    if (userRole === 'school_admin' && schoolId) {
      // School admin can only see their own school
      queryBuilder.andWhere('school.id = :schoolId', { schoolId });
    } else if (userRole === 'teacher' || userRole === 'student') {
      // Teachers and students can only see their school
      if (schoolId) {
        queryBuilder.andWhere('school.id = :schoolId', { schoolId });
      } else {
        // If no schoolId, return empty result
        queryBuilder.andWhere('1 = 0');
      }
    }
    // Super admin can see all schools (no additional filter)

    if (status && status !== 'all') {
      queryBuilder.andWhere('school.status = :status', { status });
    }

    if (type && type !== 'all') {
      queryBuilder.andWhere('school.type = :type', { type });
    }

    if (search) {
      queryBuilder.andWhere(
        '(school.name LIKE :search OR school.city LIKE :search OR school.state LIKE :search)',
        { search: `%${search}%` }
      );
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

  async findOne(id: number): Promise<School> {
    const school = await this.schoolRepository.findOne({
      where: { id },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    return school;
  }

  async findByUserId(userId: number): Promise<School> {
    const school = await this.schoolRepository.findOne({
      where: { userId: userId, isActive: 1 },
    });

    if (!school) {
      throw new NotFoundException('School not found for this user');
    }

    return school;
  }

  async create(createSchoolDto: CreateSchoolDto, userId: number): Promise<School> {
    // Create new school with PENDING status
    const school = this.schoolRepository.create({
      ...createSchoolDto,
      status: SchoolStatus.PENDING,
      isActive: 1,
      userId,
    });

    const savedSchool = await this.schoolRepository.save(school);

    // Here you can add email notification to super admin
    // await this.notifySuper AdminNewSchool(savedSchool);

    return savedSchool;
  }

  async update(id: number, updateSchoolDto: UpdateSchoolDto, userId: number): Promise<School> {
    const school = await this.findOne(id);
    
    // Update school properties
    Object.assign(school, updateSchoolDto);
    
    return this.schoolRepository.save(school);
  }

  async approveSchool(id: number, approvedById: number, comments?: string): Promise<School> {
    const school = await this.findOne(id);

    if (school.status !== SchoolStatus.PENDING) {
      throw new BadRequestException('Only pending schools can be approved');
    }

    school.status = SchoolStatus.APPROVED;
    school.approvedAt = new Date();
    school.approvedBy = approvedById;

    const approvedSchool = await this.schoolRepository.save(school);

    // Here you could add notification logic
    // await this.notificationService.notifySchoolApproval(school, comments);

    return approvedSchool;
  }

  async rejectSchool(id: number, rejectedById: number, reason: string): Promise<School> {
    const school = await this.findOne(id);

    if (school.status !== SchoolStatus.PENDING) {
      throw new BadRequestException('Only pending schools can be rejected');
    }

    school.status = SchoolStatus.REJECTED;
    school.rejectionReason = reason;
    school.approvedBy = rejectedById; // Track who made the decision

    const rejectedSchool = await this.schoolRepository.save(school);

    // Here you could add notification logic
    // await this.notificationService.notifySchoolRejection(school, reason);

    return rejectedSchool;
  }

  async suspendSchool(id: number, suspendedById: number, reason: string): Promise<School> {
    const school = await this.findOne(id);

    if (school.status === SchoolStatus.SUSPENDED) {
      throw new BadRequestException('School is already suspended');
    }

    school.status = SchoolStatus.SUSPENDED;
    school.rejectionReason = reason;
    school.approvedBy = suspendedById; // Track who made the decision

    const suspendedSchool = await this.schoolRepository.save(school);

    // Here you could add notification logic
    // await this.notificationService.notifySchoolSuspension(school, reason);

    return suspendedSchool;
  }

  async remove(id: number): Promise<{ message: string; school: School }> {
    const school = await this.findOne(id);
    
    // Soft delete - just mark as inactive instead of permanently deleting
    school.isActive = 0;
    school.status = SchoolStatus.SUSPENDED; // Mark as suspended when deleted
    
    const deletedSchool = await this.schoolRepository.save(school);
    
    return {
      message: 'School has been successfully deleted (soft delete)',
      school: deletedSchool,
    };
  }
  
  // Hard delete - permanently remove from database (use with extreme caution)
  async hardDelete(id: number): Promise<void> {
    const school = await this.findOne(id);
    await this.schoolRepository.remove(school);
  }

  async getPendingCount(): Promise<{ count: number }> {
    const count = await this.schoolRepository.count({
      where: { status: SchoolStatus.PENDING },
    });

    return { count };
  }

  async getSchoolStats() {
    const [
      totalSchools,
      pendingSchools,
      approvedSchools,
      rejectedSchools,
      suspendedSchools,
    ] = await Promise.all([
      this.schoolRepository.count(),
      this.schoolRepository.count({ where: { status: SchoolStatus.PENDING } }),
      this.schoolRepository.count({ where: { status: SchoolStatus.APPROVED } }),
      this.schoolRepository.count({ where: { status: SchoolStatus.REJECTED } }),
      this.schoolRepository.count({ where: { status: SchoolStatus.SUSPENDED } }),
    ]);

    return {
      total: totalSchools,
      pending: pendingSchools,
      approved: approvedSchools,
      rejected: rejectedSchools,
      suspended: suspendedSchools,
    };
  }
}

