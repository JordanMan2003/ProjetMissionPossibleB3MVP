import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(email: string, password: string): Promise<{
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
}
export {};
