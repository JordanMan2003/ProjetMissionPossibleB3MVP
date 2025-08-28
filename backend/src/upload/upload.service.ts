import { Injectable, NotFoundException } from '@nestjs/common';
import { unlink, access } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class UploadService {
  async deleteFile(filename: string, directory: string = 'student-proofs'): Promise<void> {
    try {
      const filePath = join(process.cwd(), 'uploads', directory, filename);
      await unlink(filePath);
    } catch (error) {
      // Si le fichier n'existe pas, on ignore l'erreur
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  getFilePath(filename: string, directory: string = 'student-proofs'): string {
    return join(process.cwd(), 'uploads', directory, filename);
  }

  async fileExists(filename: string, directory: string = 'student-proofs'): Promise<boolean> {
    try {
      const filePath = join(process.cwd(), 'uploads', directory, filename);
      await access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async validateFile(filename: string, directory: string = 'student-proofs'): Promise<void> {
    const exists = await this.fileExists(filename, directory);
    if (!exists) {
      throw new NotFoundException('Fichier non trouvé');
    }
  }
}
