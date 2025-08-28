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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const jwtAuth_guard_1 = require("../auth/jwtAuth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
const upload_service_1 = require("./upload.service");
let UploadController = class UploadController {
    uploadService;
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadProductImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('Aucun fichier fourni');
        }
        return {
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: `uploads/product-images/${file.filename}`,
            url: `/api/upload/product-image/${file.filename}`,
        };
    }
    async getProductImage(filename, res) {
        try {
            await this.uploadService.validateFile(filename, 'product-images');
            const filePath = this.uploadService.getFilePath(filename, 'product-images');
            res.sendFile(filePath);
        }
        catch (error) {
            throw new common_1.NotFoundException('Fichier non trouvé');
        }
    }
    async deleteProductImage(filename) {
        try {
            await this.uploadService.validateFile(filename, 'product-images');
            await this.uploadService.deleteFile(filename, 'product-images');
            return { message: 'Fichier supprimé avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.NotFoundException('Erreur lors de la suppression du fichier');
        }
    }
    async uploadStudentProof(file) {
        if (!file) {
            throw new common_1.BadRequestException('Aucun fichier fourni');
        }
        return {
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: `uploads/student-proofs/${file.filename}`,
        };
    }
    async getStudentProof(filename, res) {
        try {
            await this.uploadService.validateFile(filename, 'student-proofs');
            const filePath = this.uploadService.getFilePath(filename, 'student-proofs');
            res.sendFile(filePath);
        }
        catch (error) {
            throw new common_1.NotFoundException('Fichier non trouvé');
        }
    }
    async deleteStudentProof(filename) {
        try {
            await this.uploadService.validateFile(filename, 'student-proofs');
            await this.uploadService.deleteFile(filename, 'student-proofs');
            return { message: 'Fichier supprimé avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.NotFoundException('Erreur lors de la suppression du fichier');
        }
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('product-image'),
    (0, common_1.UseGuards)(jwtAuth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PRODUCER, client_1.UserRole.RESTAURANT),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/product-images',
            filename: (req, file, cb) => {
                const uniqueName = (0, uuid_1.v4)();
                const extension = (0, path_1.extname)(file.originalname);
                cb(null, `${uniqueName}${extension}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Format de fichier non supporté. Formats autorisés: JPG, PNG, WEBP'), false);
            }
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadProductImage", null);
__decorate([
    (0, common_1.Get)('product-image/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getProductImage", null);
__decorate([
    (0, common_1.Delete)('product-image/:filename'),
    (0, common_1.UseGuards)(jwtAuth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PRODUCER, client_1.UserRole.RESTAURANT),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteProductImage", null);
__decorate([
    (0, common_1.Post)('student-proof'),
    (0, common_1.UseGuards)(jwtAuth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CONSUMER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/student-proofs',
            filename: (req, file, cb) => {
                const uniqueName = (0, uuid_1.v4)();
                const extension = (0, path_1.extname)(file.originalname);
                cb(null, `${uniqueName}${extension}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Format de fichier non supporté. Formats autorisés: JPG, PNG, PDF'), false);
            }
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadStudentProof", null);
__decorate([
    (0, common_1.Get)('student-proof/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getStudentProof", null);
__decorate([
    (0, common_1.Delete)('student-proof/:filename'),
    (0, common_1.UseGuards)(jwtAuth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CONSUMER),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteStudentProof", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map