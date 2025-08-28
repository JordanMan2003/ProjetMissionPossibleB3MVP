import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    notify(userId: string, type: string, message: string): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        message: string;
        read: boolean;
    }>;
    listForUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        message: string;
        read: boolean;
    }[]>;
    markAsRead(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        message: string;
        read: boolean;
    }>;
}
