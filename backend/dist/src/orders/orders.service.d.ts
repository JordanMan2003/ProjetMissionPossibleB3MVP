import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class OrdersService {
    private readonly prisma;
    private readonly notifications;
    private stripe;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    notifyOrderReady(sellerUserId: string, orderId: string): Promise<{
        ok: boolean;
    }>;
    confirmOrderPickup(customerUserId: string, orderId: string): Promise<{
        ok: boolean;
    }>;
    createCheckoutFromCart(userId: string): Promise<{
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
    handleWebhook(event: Stripe.Event): Promise<void>;
    listOrdersForUser(userId: string): Promise<({
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
    getOrderForUser(userId: string, orderId: string): Promise<{
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
    listOrdersForSeller(sellerUserId: string): Promise<({
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
}
