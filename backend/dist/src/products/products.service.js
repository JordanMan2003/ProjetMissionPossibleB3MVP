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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listAll(filters) {
        const where = {};
        if (filters?.type && filters.type !== 'all') {
            where.type = filters.type;
        }
        if (filters?.region && filters.region !== 'all') {
            where.region = filters.region;
        }
        if (filters?.solidaire) {
            where.solidaire = true;
        }
        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
                { producer: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.product.findMany({
            where,
            include: {
                category: true,
                owner: true,
                contents: {
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async createProduct(ownerId, data) {
        const owner = await this.prisma.user.findUnique({ where: { id: ownerId } });
        if (!owner || (owner.role !== client_1.UserRole.PRODUCER && owner.role !== client_1.UserRole.RESTAURANT)) {
            throw new common_1.ForbiddenException('Only producers or restaurants can create products');
        }
        if (owner.accountStatus !== client_1.AccountStatus.APPROVED) {
            throw new common_1.ForbiddenException('Account not approved');
        }
        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                originalPrice: data.originalPrice,
                stock: data.stock,
                imageUrl: data.imageUrl,
                categoryId: data.categoryId,
                type: data.type,
                region: data.region,
                producer: data.producer,
                rating: data.rating || 0,
                reviews: data.reviews || 0,
                solidaire: data.solidaire || false,
                distance: data.distance,
                isRestaurant: data.isRestaurant || false,
                expiryNote: data.expiryNote,
                ownerId,
                contents: data.contents ? {
                    create: data.contents
                } : undefined,
            },
            include: {
                contents: {
                    orderBy: { order: 'asc' }
                }
            }
        });
    }
    async getById(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: {
                contents: { orderBy: { order: 'asc' } },
                category: true,
                owner: true,
            },
        });
    }
    async updateProduct(ownerId, id, data) {
        const owner = await this.prisma.user.findUnique({ where: { id: ownerId } });
        if (!owner || (owner.role !== client_1.UserRole.PRODUCER && owner.role !== client_1.UserRole.RESTAURANT)) {
            throw new common_1.ForbiddenException('Only producers or restaurants can update products');
        }
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product || product.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('Not allowed');
        }
        return this.prisma.product.update({
            where: { id },
            data: {
                ...(data.name !== undefined ? { name: data.name } : {}),
                ...(data.description !== undefined ? { description: data.description } : {}),
                ...(data.price !== undefined ? { price: data.price } : {}),
                ...(data.originalPrice !== undefined ? { originalPrice: data.originalPrice } : {}),
                ...(data.stock !== undefined ? { stock: data.stock } : {}),
                ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
                ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
                ...(data.type !== undefined ? { type: data.type } : {}),
                ...(data.region !== undefined ? { region: data.region } : {}),
                ...(data.producer !== undefined ? { producer: data.producer } : {}),
                ...(data.rating !== undefined ? { rating: data.rating } : {}),
                ...(data.reviews !== undefined ? { reviews: data.reviews } : {}),
                ...(data.solidaire !== undefined ? { solidaire: data.solidaire } : {}),
                ...(data.distance !== undefined ? { distance: data.distance } : {}),
                ...(data.isRestaurant !== undefined ? { isRestaurant: data.isRestaurant } : {}),
                ...(data.expiryNote !== undefined ? { expiryNote: data.expiryNote } : {}),
            },
            include: { contents: { orderBy: { order: 'asc' } } },
        });
    }
    async deleteProduct(ownerId, id) {
        const owner = await this.prisma.user.findUnique({ where: { id: ownerId } });
        if (!owner || (owner.role !== client_1.UserRole.PRODUCER && owner.role !== client_1.UserRole.RESTAURANT)) {
            throw new common_1.ForbiddenException('Only producers or restaurants can delete products');
        }
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product || product.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('Not allowed');
        }
        return this.prisma.product.delete({ where: { id } });
    }
    async findAll() {
        return this.prisma.product.findMany({
            include: {
                contents: {
                    orderBy: { order: 'asc' },
                },
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            where: {
                isActive: true,
                stock: { gt: 0 },
            },
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'desc' },
            ],
        });
    }
    async findActiveProducts() {
        return this.prisma.product.findMany({
            include: {
                contents: {
                    orderBy: { order: 'asc' },
                },
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            where: {
                isActive: true,
                stock: { gt: 0 },
            },
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'desc' },
            ],
        });
    }
    async searchProducts(query, filters) {
        const where = {
            isActive: true,
            stock: { gt: 0 },
        };
        if (filters?.type && filters.type !== 'all') {
            where.type = filters.type;
        }
        if (filters?.region && filters.region !== 'all') {
            where.region = filters.region;
        }
        if (filters?.solidaire) {
            where.solidaire = true;
        }
        if (filters?.categoryId) {
            where.categoryId = filters.categoryId;
        }
        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { producer: { contains: query, mode: 'insensitive' } },
            ];
        }
        return this.prisma.product.findMany({
            where,
            include: {
                contents: {
                    orderBy: { order: 'asc' },
                },
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'desc' },
            ],
        });
    }
    async getFeaturedProducts() {
        return this.prisma.product.findMany({
            where: {
                featured: true,
                isActive: true,
                stock: { gt: 0 },
            },
            include: {
                contents: {
                    orderBy: { order: 'asc' },
                },
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 8,
        });
    }
    async getProductsByCategory(categoryId) {
        return this.prisma.product.findMany({
            where: {
                categoryId,
                isActive: true,
                stock: { gt: 0 },
            },
            include: {
                contents: {
                    orderBy: { order: 'asc' },
                },
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'desc' },
            ],
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map