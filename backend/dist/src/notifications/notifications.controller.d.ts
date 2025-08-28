import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notifications;
    constructor(notifications: NotificationsService);
    list(req: any): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        message: string;
        read: boolean;
    }[]>;
    markRead(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        message: string;
        read: boolean;
    }>;
}
