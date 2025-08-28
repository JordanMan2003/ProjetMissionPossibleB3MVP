import { OrdersService } from './orders.service';
import type { Request, Response } from 'express';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    checkout(req: any): Promise<{
        clientSecret: string;
        orders: {
            orderId: string;
            total: number;
        }[];
        status: "PAID";
        lowStockWarnings: {
            productId: string;
            name: string;
            stock: number;
        }[];
        message: string;
    } | {
        clientSecret: string | null;
        orders?: undefined;
        status?: undefined;
        lowStockWarnings?: undefined;
        message?: undefined;
    }>;
    listMyOrders(req: any): Promise<({
        items: ({
            product: {
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
    listSellerOrders(req: any): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string;
        };
        items: ({
            product: {
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
    getOrder(req: any, id: string): Promise<{
        items: ({
            product: {
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
    notifyReady(req: any, id: string): Promise<{
        ok: boolean;
    }>;
    confirmPickup(req: any, id: string): Promise<{
        ok: boolean;
    }>;
    webhook(req: Request, res: Response, signature?: string): Promise<void>;
}
