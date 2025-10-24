import { Repository } from 'typeorm';
import { School } from './entities/school.entity';
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
export declare class SchoolsService {
    private schoolRepository;
    constructor(schoolRepository: Repository<School>);
    findAll(options: FindAllOptions): Promise<{
        data: School[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<School>;
    findByUserId(userId: number): Promise<School>;
    create(createSchoolDto: CreateSchoolDto, userId: number): Promise<School>;
    update(id: number, updateSchoolDto: UpdateSchoolDto, userId: number): Promise<School>;
    approveSchool(id: number, approvedById: number, comments?: string): Promise<School>;
    rejectSchool(id: number, rejectedById: number, reason: string): Promise<School>;
    suspendSchool(id: number, suspendedById: number, reason: string): Promise<School>;
    remove(id: number): Promise<{
        message: string;
        school: School;
    }>;
    hardDelete(id: number): Promise<void>;
    getPendingCount(): Promise<{
        count: number;
    }>;
    getSchoolStats(): Promise<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        suspended: number;
    }>;
}
export {};
