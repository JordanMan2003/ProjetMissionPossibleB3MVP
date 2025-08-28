"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(input) {
        const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const user = await this.prisma.user.create({
            data: {
                email: input.email,
                passwordHash: input.passwordHash,
                fullName: input.fullName,
                role: input.role,
                accountStatus: input.role === 'CONSUMER' ? client_1.AccountStatus.APPROVED : client_1.AccountStatus.PENDING,
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
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async approveUser(id) {
        return this.prisma.user.update({
            where: { id },
            data: { accountStatus: client_1.AccountStatus.APPROVED },
        });
    }
    async updateUser(id, data) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id },
            data: {
                ...(data.fullName ? { fullName: data.fullName } : {}),
                ...(data.email ? { email: data.email } : {}),
            },
        });
    }
    async deleteUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const cart = await this.prisma.cart.findUnique({ where: { userId: id } });
        if (cart) {
            await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
            await this.prisma.cart.delete({ where: { id: cart.id } });
        }
        const orders = await this.prisma.order.findMany({ where: { userId: id } });
        if (orders.length > 0) {
            const orderIds = orders.map((o) => o.id);
            await this.prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
            await this.prisma.order.deleteMany({ where: { id: { in: orderIds } } });
        }
        const products = await this.prisma.product.findMany({ where: { ownerId: id } });
        if (products.length > 0) {
            const productIds = products.map((p) => p.id);
            await this.prisma.productContent.deleteMany({ where: { productId: { in: productIds } } });
            await this.prisma.product.deleteMany({ where: { id: { in: productIds } } });
        }
        return this.prisma.user.delete({ where: { id } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map