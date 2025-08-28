import type { Response } from 'express';
import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadProductImage(file: Express.Multer.File): Promise<{
        filename: string;
        originalName: string;
        mimetype: string;
        size: number;
        path: string;
        url: string;
    }>;
    getProductImage(filename: string, res: Response): Promise<void>;
    deleteProductImage(filename: string): Promise<{
        message: string;
    }>;
    uploadStudentProof(file: Express.Multer.File): Promise<{
        filename: string;
        originalName: string;
        mimetype: string;
        size: number;
        path: string;
    }>;
    getStudentProof(filename: string, res: Response): Promise<void>;
    deleteStudentProof(filename: string): Promise<{
        message: string;
    }>;
}
