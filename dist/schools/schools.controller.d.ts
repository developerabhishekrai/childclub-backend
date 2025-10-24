import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { ApproveSchoolDto } from './dto/approve-school.dto';
import { RejectSchoolDto } from './dto/reject-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
export declare class SchoolsController {
    private readonly schoolsService;
    constructor(schoolsService: SchoolsService);
    findAll(status?: string, type?: string, search?: string, page?: number, limit?: number, req?: any): Promise<{
        data: import("./entities/school.entity").School[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getPendingCount(req: any): Promise<{
        count: number;
    }>;
    findMySchool(req: any): Promise<import("./entities/school.entity").School>;
    findOne(id: string): Promise<import("./entities/school.entity").School>;
    create(createSchoolDto: CreateSchoolDto, req: any): Promise<import("./entities/school.entity").School>;
    update(id: string, updateSchoolDto: UpdateSchoolDto, req: any): Promise<import("./entities/school.entity").School>;
    approveSchool(id: string, approveSchoolDto: ApproveSchoolDto, req: any): Promise<import("./entities/school.entity").School>;
    rejectSchool(id: string, rejectSchoolDto: RejectSchoolDto, req: any): Promise<import("./entities/school.entity").School>;
    suspendSchool(id: string, rejectSchoolDto: RejectSchoolDto, req: any): Promise<import("./entities/school.entity").School>;
    remove(id: string, req: any): Promise<{
        message: string;
        school: import("./entities/school.entity").School;
    }>;
}
