import { ClassStatus } from '../entities/class.entity';
export declare class UpdateClassDto {
    name?: string;
    grade?: string;
    section?: string;
    academicYear?: string;
    maxStudents?: string;
    description?: string;
    subjects?: string[];
    syllabus?: string;
    rules?: string;
    classTeacherId?: number;
    startDate?: string;
    endDate?: string;
    schedule?: string;
    roomNumber?: string;
    schoolId?: number;
    status?: ClassStatus;
}
