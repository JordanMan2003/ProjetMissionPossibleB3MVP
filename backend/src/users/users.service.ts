import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountStatus, UserRole } from '@prisma/client';

interface CreateUserInput {
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  siret?: string;
  iban?: string;
  bic?: string;
  producerCertified?: boolean;
  isStudent?: boolean;
  studentProof?: string | null;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateUserInput) {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new ConflictException('Email already in use');

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        fullName: input.fullName,
        role: input.role,
        accountStatus: input.role === 'CONSUMER' ? AccountStatus.APPROVED : AccountStatus.PENDING,
        cart: input.role === 'CONSUMER' ? { create: {} } : undefined,
        siret: input.siret,
        iban: input.iban,
        bic: input.bic,
        producerCertified: input.role === 'PRODUCER' ? !!input.producerCertified : false,
        isStudent: input.role === 'CONSUMER' ? !!input.isStudent : false,
        studentProof: input.role === 'CONSUMER' && input.isStudent ? input.studentProof ?? null : null,
      },
    });
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async approveUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { accountStatus: AccountStatus.APPROVED },
    });
  }

  async updateUser(id: string, data: Partial<{ fullName: string; email: string }>) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(data.fullName ? { fullName: data.fullName } : {}),
        ...(data.email ? { email: data.email } : {}),
      },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    // Delete related data to avoid FK violations
    // Cart and its items
    const cart = await this.prisma.cart.findUnique({ where: { userId: id } });
    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      await this.prisma.cart.delete({ where: { id: cart.id } });
    }

    // Orders and items
    const orders = await this.prisma.order.findMany({ where: { userId: id } });
    if (orders.length > 0) {
      const orderIds = orders.map((o) => o.id);
      await this.prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
      await this.prisma.order.deleteMany({ where: { id: { in: orderIds } } });
    }

    // Products owned by user (ProductContent has onDelete: Cascade)
    const products = await this.prisma.product.findMany({ where: { ownerId: id } });
    if (products.length > 0) {
      const productIds = products.map((p) => p.id);
      await this.prisma.productContent.deleteMany({ where: { productId: { in: productIds } } });
      await this.prisma.product.deleteMany({ where: { id: { in: productIds } } });
    }

    return this.prisma.user.delete({ where: { id } });
  }
}

