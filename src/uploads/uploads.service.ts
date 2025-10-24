import { Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadsService {
  private readonly uploadPath = path.join(process.cwd(), '..', 'uploads', 'submissions');

  constructor() {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  validateFile(file: Express.Multer.File): void {
    // Allowed file types
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Allowed types: images (jpg, png, gif), PDF, Word, Excel',
      );
    }

    // Max file size: 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 10MB');
    }
  }

  generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = extname(originalName);
    return `${timestamp}-${randomString}${ext}`;
  }

  getUploadPath(): string {
    return this.uploadPath;
  }

  deleteFile(filename: string): void {
    const filePath = path.join(this.uploadPath, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

