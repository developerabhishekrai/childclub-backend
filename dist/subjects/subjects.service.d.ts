import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { School } from '../schools/entities/school.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
export declare class SubjectsService {
    private subjectsRepository;
    private schoolsRepository;
    constructor(subjectsRepository: Repository<Subject>, schoolsRepository: Repository<School>);
    createSubject(createSubjectDto: CreateSubjectDto): Promise<Subject>;
    findAllSubjects(schoolId: number): Promise<Subject[]>;
    findSubjectById(id: number): Promise<Subject>;
    findSubjectsByGrade(schoolId: number, gradeLevel: string): Promise<Subject[]>;
    updateSubject(id: number, updateSubjectDto: UpdateSubjectDto): Promise<Subject>;
    deleteSubject(id: number): Promise<void>;
    getSubjectStats(schoolId: number): Promise<{
        total: number;
        active: number;
        inactive: number;
        elective: number;
        core: number;
    }>;
}
