import { PrismaService } from '../prisma/prisma.service';
export declare class CartService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): Promise<{
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
            quantity: number;
            cartId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    addItem(userId: string, productId: string, quantity: number): Promise<{
        id: string;
        productId: string;
        quantity: number;
        cartId: string;
    }>;
    removeItem(userId: string, productId: string): Promise<{
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
            quantity: number;
            cartId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    setItemQuantity(userId: string, productId: string, quantity: number): Promise<{
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
            quantity: number;
            cartId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    clearCart(userId: string): Promise<{
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
            quantity: number;
            cartId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
}
