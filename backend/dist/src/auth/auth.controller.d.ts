import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '@prisma/client';
declare class RegisterDto {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    siret?: string;
    iban?: string;
    bic?: string;
    producerCertified?: boolean;
    isStudent?: boolean;
    studentProof?: string;
}
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    register(dto: RegisterDto): Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
            accountStatus: any;
        };
    } | {
        message: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: "PRODUCER" | "RESTAURANT" | "ADMIN";
            accountStatus: import(".prisma/client").$Enums.AccountStatus;
        };
    }>;
    login(_body: any, req: any): Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
            accountStatus: any;
        };
    }>;
    forgotPassword(body: {
        email: string;
    }): Promise<{
        message: string;
        resetToken?: undefined;
    } | {
        message: string;
        resetToken: string;
    }>;
    resetPassword(body: {
        token: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    refreshToken(body: {
        token?: string;
    }, req: any): Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
            accountStatus: any;
        };
    }>;
}
export {};
