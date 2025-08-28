"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("fs/promises");
const path_1 = require("path");
let UploadService = class UploadService {
    async deleteFile(filename, directory = 'student-proofs') {
        try {
            const filePath = (0, path_1.join)(process.cwd(), 'uploads', directory, filename);
            await (0, promises_1.unlink)(filePath);
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
    getFilePath(filename, directory = 'student-proofs') {
        return (0, path_1.join)(process.cwd(), 'uploads', directory, filename);
    }
    async fileExists(filename, directory = 'student-proofs') {
        try {
            const filePath = (0, path_1.join)(process.cwd(), 'uploads', directory, filename);
            await (0, promises_1.access)(filePath);
            return true;
        }
        catch {
            return false;
        }
    }
    async validateFile(filename, directory = 'student-proofs') {
        const exists = await this.fileExists(filename, directory);
        if (!exists) {
            throw new common_1.NotFoundException('Fichier non trouvé');
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=upload.service.js.map