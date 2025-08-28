import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly prisma;
    constructor(usersService: UsersService, jwtService: JwtService, prisma: PrismaService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
        accountStatus: import(".prisma/client").$Enums.AccountStatus;
        createdAt: Date;
        updatedAt: Date;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        bic: string | null;
        iban: string | null;
        siret: string | null;
        isStudent: boolean;
        producerCertified: boolean;
        studentProof: string | null;
    }>;
    login(user: any): Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
            accountStatus: any;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
        resetToken?: undefined;
    } | {
        message: string;
        resetToken: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    refresh(token: string): Promise<{
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
