import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength, ValidateIf, Matches, Length, IsOptional } from 'class-validator';
import { LocalAuthGuard } from './localAuth.guard';
import { UsersService } from '../users/users.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  fullName: string;

  @IsEnum(UserRole)
  role: UserRole;

  // Professional fields (optional based on role)
  @ValidateIf((o) => o.role === UserRole.RESTAURANT || o.role === UserRole.PRODUCER)
  @IsNotEmpty({ message: 'SIRET requis pour ce type de compte' })
  @Matches(/^\d{14}$/, { message: 'SIRET invalide: 14 chiffres requis' })
  siret?: string;

  @ValidateIf((o) => o.role === UserRole.RESTAURANT || o.role === UserRole.PRODUCER)
  @IsNotEmpty({ message: 'IBAN requis pour ce type de compte' })
  @Matches(/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/, { message: 'Format IBAN invalide' })
  @Length(15, 34, { message: 'IBAN doit faire entre 15 et 34 caractères' })
  iban?: string;

  @ValidateIf((o) => o.role === UserRole.RESTAURANT || o.role === UserRole.PRODUCER)
  @IsNotEmpty({ message: 'BIC requis pour ce type de compte' })
  @Matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, { message: 'Format BIC/SWIFT invalide' })
  @Length(8, 11, { message: 'BIC/SWIFT doit faire entre 8 et 11 caractères' })
  bic?: string;

  // Producer certification
  @ValidateIf((o) => o.role === UserRole.PRODUCER)
  @IsNotEmpty({ message: 'Certification producteur local requise' })
  producerCertified?: boolean;

  // Consumer fields
  @ValidateIf((o) => o.role === UserRole.CONSUMER)
  @IsOptional()
  isStudent?: boolean;

  @ValidateIf((o) => o.role === UserRole.CONSUMER && o.isStudent === true)
  @IsNotEmpty({ message: 'Un justificatif est requis pour un compte étudiant' })
  studentProof?: string; // store path or URL
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      role: dto.role,
      // pass professional fields if any
      siret: dto.siret,
      iban: dto.iban,
      bic: dto.bic,
      producerCertified: dto.role === UserRole.PRODUCER ? dto.producerCertified : false,
      isStudent: dto.isStudent === true,
      studentProof: dto.isStudent ? dto.studentProof : null,
    });
    // If user is PRODUCER or RESTAURANT, accountStatus is PENDING => do not auto-login
    if (user.role === UserRole.CONSUMER) {
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

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() _body: any, @Req() req: any) {
    return this.authService.login(req.user);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Post('refresh')
  async refreshToken(@Body() body: { token?: string }, @Req() req: any) {
    const authHeader: string | undefined = req.headers?.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : undefined;
    const token = body?.token || bearerToken;
    return this.authService.refresh(token || '');
  }
}

