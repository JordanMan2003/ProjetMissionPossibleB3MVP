"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const localAuth_guard_1 = require("./localAuth.guard");
const users_service_1 = require("../users/users.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
class RegisterDto {
    email;
    password;
    fullName;
    role;
    siret;
    iban;
    bic;
    producerCertified;
    isStudent;
    studentProof;
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.UserRole),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.role === client_1.UserRole.RESTAURANT || o.role === client_1.UserRole.PRODUCER),
    (0, class_validator_1.IsNotEmpty)({ message: 'SIRET requis pour ce type de compte' }),
    (0, class_validator_1.Matches)(/^\d{14}$/, { message: 'SIRET invalide: 14 chiffres requis' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "siret", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.role === client_1.UserRole.RESTAURANT || o.role === client_1.UserRole.PRODUCER),
    (0, class_validator_1.IsNotEmpty)({ message: 'IBAN requis pour ce type de compte' }),
    (0, class_validator_1.Matches)(/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/, { message: 'Format IBAN invalide' }),
    (0, class_validator_1.Length)(15, 34, { message: 'IBAN doit faire entre 15 et 34 caractères' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "iban", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.role === client_1.UserRole.RESTAURANT || o.role === client_1.UserRole.PRODUCER),
    (0, class_validator_1.IsNotEmpty)({ message: 'BIC requis pour ce type de compte' }),
    (0, class_validator_1.Matches)(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, { message: 'Format BIC/SWIFT invalide' }),
    (0, class_validator_1.Length)(8, 11, { message: 'BIC/SWIFT doit faire entre 8 et 11 caractères' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "bic", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.role === client_1.UserRole.PRODUCER),
    (0, class_validator_1.IsNotEmpty)({ message: 'Certification producteur local requise' }),
    __metadata("design:type", Boolean)
], RegisterDto.prototype, "producerCertified", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.role === client_1.UserRole.CONSUMER),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], RegisterDto.prototype, "isStudent", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.role === client_1.UserRole.CONSUMER && o.isStudent === true),
    (0, class_validator_1.IsNotEmpty)({ message: 'Un justificatif est requis pour un compte étudiant' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "studentProof", void 0);
let AuthController = class AuthController {
    authService;
    usersService;
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async register(dto) {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create({
            email: dto.email,
            passwordHash,
            fullName: dto.fullName,
            role: dto.role,
            siret: dto.siret,
            iban: dto.iban,
            bic: dto.bic,
            producerCertified: dto.role === client_1.UserRole.PRODUCER ? dto.producerCertified : false,
            isStudent: dto.isStudent === true,
            studentProof: dto.isStudent ? dto.studentProof : null,
        });
        if (user.role === client_1.UserRole.CONSUMER) {
            return this.authService.login(user);
        }
        return {
            message: 'Votre compte a été créé. Il sera vérifié par un administrateur sous 24-48h.',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                accountStatus: user.accountStatus,
            },
        };
    }
    async login(_body, req) {
        return this.authService.login(req.user);
    }
    async forgotPassword(body) {
        return this.authService.forgotPassword(body.email);
    }
    async resetPassword(body) {
        return this.authService.resetPassword(body.token, body.newPassword);
    }
    async refreshToken(body, req) {
        const authHeader = req.headers?.authorization;
        const bearerToken = authHeader?.startsWith('Bearer ')
            ? authHeader.substring(7)
            : undefined;
        const token = body?.token || bearerToken;
        return this.authService.refresh(token || '');
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(localAuth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map