import { Response } from 'express';
import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadFile(file: Express.Multer.File): Promise<{
        success: boolean;
        filename: string;
        originalName: string;
        mimetype: string;
        size: number;
        url: string;
    }>;
    uploadMultipleFiles(files: Express.Multer.File[]): Promise<{
        success: boolean;
        files: {
            filename: string;
            originalName: string;
            mimetype: string;
            size: number;
            url: string;
        }[];
    }>;
    getFile(filename: string, res: Response): Promise<void>;
    deleteFile(filename: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
