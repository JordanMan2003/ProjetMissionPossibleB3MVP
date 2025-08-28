export declare class UploadService {
    deleteFile(filename: string, directory?: string): Promise<void>;
    getFilePath(filename: string, directory?: string): string;
    fileExists(filename: string, directory?: string): Promise<boolean>;
    validateFile(filename: string, directory?: string): Promise<void>;
}
