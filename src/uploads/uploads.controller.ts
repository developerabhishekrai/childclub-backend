import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as path from 'path';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('submission')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(process.cwd(), '..', 'uploads', 'submissions');
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 15);
          const ext = path.extname(file.originalname);
          cb(null, `${timestamp}-${randomString}${ext}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.uploadsService.validateFile(file);

    return {
      success: true,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/submission/${file.filename}`,
    };
  }

  @Post('submission/multiple')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(process.cwd(), '..', 'uploads', 'submissions');
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 15);
          const ext = path.extname(file.originalname);
          cb(null, `${timestamp}-${randomString}${ext}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
      },
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    files.forEach(file => this.uploadsService.validateFile(file));

    return {
      success: true,
      files: files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/submission/${file.filename}`,
      })),
    };
  }

  @Get('submission/:filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(this.uploadsService.getUploadPath(), filename);
    res.sendFile(filePath);
  }

  @Delete('submission/:filename')
  @UseGuards(JwtAuthGuard)
  async deleteFile(@Param('filename') filename: string) {
    this.uploadsService.deleteFile(filename);
    return {
      success: true,
      message: 'File deleted successfully',
    };
  }
}

