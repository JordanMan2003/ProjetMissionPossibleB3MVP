import { PrismaService } from '../prisma/prisma.service';
import { AccountStatus, OrderStatus } from '@prisma/client';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalProducts: number;
        totalOrders: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        pendingUsers: number;
        activeProducts: number;
        pendingOrders: number;
        userGrowth: number;
        productGrowth: number;
        orderGrowth: number;
        revenueGrowth: number;
    }>;
    getAllUsers(): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
        accountStatus: import(".prisma/client").$Enums.AccountStatus;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            orders: number;
            products: number;
        };
    }[]>;
    updateUserStatus(userId: string, status: AccountStatus): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
        accountStatus: import(".prisma/client").$Enums.AccountStatus;
        createdAt: Date;
    }>;
    deleteUser(userId: string): Promise<{
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
    getAllProducts(): Promise<({
        category: {
            id: string;
            name: string;
        } | null;
        owner: {
            id: string;
            email: string;
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        originalPrice: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        stock: number;
        imageUrl: string | null;
        type: string;
        region: string;
        producer: string;
        rating: import("@prisma/client/runtime/library").Decimal;
        reviews: number;
        solidaire: boolean;
        distance: string;
        isRestaurant: boolean;
        expiryNote: string | null;
        isActive: boolean;
        featured: boolean;
        ownerId: string;
        categoryId: string | null;
    })[]>;
    updateProductStatus(productId: string, isActive: boolean): Promise<{
        category: {
            id: string;
            name: string;
        } | null;
        owner: {
            id: string;
            email: string;
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        originalPrice: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        stock: number;
        imageUrl: string | null;
        type: string;
        region: string;
        producer: string;
        rating: import("@prisma/client/runtime/library").Decimal;
        reviews: number;
        solidaire: boolean;
        distance: string;
        isRestaurant: boolean;
        expiryNote: string | null;
        isActive: boolean;
        featured: boolean;
        ownerId: string;
        categoryId: string | null;
    }>;
    deleteProduct(productId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        originalPrice: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        stock: number;
        imageUrl: string | null;
        type: string;
        region: string;
        producer: string;
        rating: import("@prisma/client/runtime/library").Decimal;
        reviews: number;
        solidaire: boolean;
        distance: string;
        isRestaurant: boolean;
        expiryNote: string | null;
        isActive: boolean;
        featured: boolean;
        ownerId: string;
        categoryId: string | null;
    }>;
    getAllOrders(): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string;
        };
        items: ({
            product: {
                id: string;
                name: string;
                price: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            productId: string;
            orderId: string;
            quantity: number;
            priceAtPurchase: import("@prisma/client/runtime/library").Decimal;
            sellerReady: boolean;
            pickedUp: boolean;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentIntentId: string | null;
    })[]>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
        };
        items: ({
            product: {
                id: string;
                name: string;
                price: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            productId: string;
            orderId: string;
            quantity: number;
            priceAtPurchase: import("@prisma/client/runtime/library").Decimal;
            sellerReady: boolean;
            pickedUp: boolean;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentIntentId: string | null;
    }>;
    getAllCategories(): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    })[]>;
    createCategory(data: {
        name: string;
        slug: string;
    }): Promise<{
        _count: {
            products: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    }>;
    updateCategory(categoryId: string, data: {
        name: string;
        slug: string;
    }): Promise<{
        _count: {
            products: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    }>;
    deleteCategory(categoryId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    }>;
    getSalesReport(startDate: string, endDate: string): Promise<{
        orders: ({
            user: {
                email: string;
                fullName: string;
            };
            items: ({
                product: {
                    name: string;
                    price: import("@prisma/client/runtime/library").Decimal;
                };
            } & {
                id: string;
                productId: string;
                orderId: string;
                quantity: number;
                priceAtPurchase: import("@prisma/client/runtime/library").Decimal;
                sellerReady: boolean;
                pickedUp: boolean;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            total: import("@prisma/client/runtime/library").Decimal;
            status: import(".prisma/client").$Enums.OrderStatus;
            paymentIntentId: string | null;
        })[];
        totalRevenue: number;
        totalOrders: number;
        averageOrderValue: number;
    }>;
}
