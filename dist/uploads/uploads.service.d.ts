export declare class UploadsService {
    private readonly uploadPath;
    constructor();
    validateFile(file: Express.Multer.File): void;
    generateFileName(originalName: string): string;
    getUploadPath(): string;
    deleteFile(filename: string): void;
}
