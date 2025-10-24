"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const uploads_service_1 = require("./uploads.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const path = require("path");
let UploadsController = class UploadsController {
    constructor(uploadsService) {
        this.uploadsService = uploadsService;
    }
    async uploadFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
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
    async uploadMultipleFiles(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files uploaded');
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
    async getFile(filename, res) {
        const filePath = path.join(this.uploadsService.getUploadPath(), filename);
        res.sendFile(filePath);
    }
    async deleteFile(filename) {
        this.uploadsService.deleteFile(filename);
        return {
            success: true,
            message: 'File deleted successfully',
        };
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)('submission'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
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
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('submission/multiple'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5, {
        storage: (0, multer_1.diskStorage)({
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
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadMultipleFiles", null);
__decorate([
    (0, common_1.Get)('submission/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "getFile", null);
__decorate([
    (0, common_1.Delete)('submission/:filename'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "deleteFile", null);
exports.UploadsController = UploadsController = __decorate([
    (0, common_1.Controller)('uploads'),
    __metadata("design:paramtypes", [uploads_service_1.UploadsService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map