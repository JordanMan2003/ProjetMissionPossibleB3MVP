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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalUsers, totalProducts, totalOrders, totalRevenue, pendingUsers, activeProducts, pendingOrders] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.product.count(),
            this.prisma.order.count(),
            this.prisma.order.aggregate({
                where: { status: 'PAID' },
                _sum: { total: true }
            }),
            this.prisma.user.count({
                where: { accountStatus: 'PENDING' }
            }),
            this.prisma.product.count({
                where: { stock: { gt: 0 } }
            }),
            this.prisma.order.count({
                where: { status: 'PENDING' }
            })
        ]);
        return {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenue._sum.total || 0,
            pendingUsers,
            activeProducts,
            pendingOrders,
            userGrowth: 12,
            productGrowth: 8,
            orderGrowth: 15,
            revenueGrowth: 23
        };
    }
    async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                accountStatus: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        products: true,
                        orders: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateUserStatus(userId, status) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { accountStatus: status },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                accountStatus: true,
                createdAt: true
            }
        });
    }
    async deleteUser(userId) {
        return this.prisma.user.delete({
            where: { id: userId }
        });
    }
    async getAllProducts() {
        return this.prisma.product.findMany({
            include: {
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateProductStatus(productId, isActive) {
        return this.prisma.product.update({
            where: { id: productId },
            data: { stock: isActive ? 1 : 0 },
            include: {
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }
    async deleteProduct(productId) {
        return this.prisma.product.delete({
            where: { id: productId }
        });
    }
    async getAllOrders() {
        return this.prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateOrderStatus(orderId, status) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            }
        });
    }
    async getAllCategories() {
        return this.prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });
    }
    async createCategory(data) {
        return this.prisma.category.create({
            data,
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });
    }
    async updateCategory(categoryId, data) {
        return this.prisma.category.update({
            where: { id: categoryId },
            data,
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });
    }
    async deleteCategory(categoryId) {
        return this.prisma.category.delete({
            where: { id: categoryId }
        });
    }
    async getSalesReport(startDate, endDate) {
        const orders = await this.prisma.order.findMany({
            where: {
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                },
                status: 'PAID'
            },
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
        const totalOrders = orders.length;
        return {
            orders,
            totalRevenue,
            totalOrders,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map