import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
export declare class SubjectsController {
    private readonly subjectsService;
    constructor(subjectsService: SubjectsService);
    createSubject(createSubjectDto: CreateSubjectDto, req: any): Promise<import("./entities/subject.entity").Subject>;
    findAllSubjects(req: any, schoolId?: string): Promise<import("./entities/subject.entity").Subject[]>;
    getSubjectStats(req: any): Promise<{
        total: number;
        active: number;
        inactive: number;
        elective: number;
        core: number;
    }>;
    findSubjectsByGrade(gradeLevel: string, req: any): Promise<import("./entities/subject.entity").Subject[]>;
    findSubjectById(id: string): Promise<import("./entities/subject.entity").Subject>;
    updateSubject(id: string, updateSubjectDto: UpdateSubjectDto): Promise<import("./entities/subject.entity").Subject>;
    deleteSubject(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
