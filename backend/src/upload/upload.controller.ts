import { Controller, Post, Get, Delete, UseInterceptors, UploadedFile, BadRequestException, UseGuards, Param, Res, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('product-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PRODUCER, UserRole.RESTAURANT)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/product-images',
        filename: (req, file, cb) => {
          const uniqueName = uuidv4();
          const extension = extname(file.originalname);
          cb(null, `${uniqueName}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Format de fichier non supporté. Formats autorisés: JPG, PNG, WEBP'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
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

  @Get('product-image/:filename')
  async getProductImage(@Param('filename') filename: string, @Res() res: Response) {
    try {
      await this.uploadService.validateFile(filename, 'product-images');
      const filePath = this.uploadService.getFilePath(filename, 'product-images');
      res.sendFile(filePath);
    } catch (error) {
      throw new NotFoundException('Fichier non trouvé');
    }
  }

  @Delete('product-image/:filename')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PRODUCER, UserRole.RESTAURANT)
  async deleteProductImage(@Param('filename') filename: string) {
    try {
      await this.uploadService.validateFile(filename, 'product-images');
      await this.uploadService.deleteFile(filename, 'product-images');
      return { message: 'Fichier supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Erreur lors de la suppression du fichier');
    }
  }

  @Post('student-proof')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSUMER)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/student-proofs',
        filename: (req, file, cb) => {
          const uniqueName = uuidv4();
          const extension = extname(file.originalname);
          cb(null, `${uniqueName}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Format de fichier non supporté. Formats autorisés: JPG, PNG, PDF'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadStudentProof(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    return {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: `uploads/student-proofs/${file.filename}`,
    };
  }

  @Get('student-proof/:filename')
  async getStudentProof(@Param('filename') filename: string, @Res() res: Response) {
    try {
      await this.uploadService.validateFile(filename, 'student-proofs');
      const filePath = this.uploadService.getFilePath(filename, 'student-proofs');
      res.sendFile(filePath);
    } catch (error) {
      throw new NotFoundException('Fichier non trouvé');
    }
  }

  @Delete('student-proof/:filename')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSUMER)
  async deleteStudentProof(@Param('filename') filename: string) {
    try {
      await this.uploadService.validateFile(filename, 'student-proofs');
      await this.uploadService.deleteFile(filename, 'student-proofs');
      return { message: 'Fichier supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Erreur lors de la suppression du fichier');
    }
  }
}
