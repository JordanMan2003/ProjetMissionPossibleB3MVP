import { CartService } from './cart.service';
declare class AddItemDto {
    productId: string;
    quantity: number;
}
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    get(req: any): Promise<{
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
    add(req: any, dto: AddItemDto): Promise<{
        id: string;
        productId: string;
        quantity: number;
        cartId: string;
    }>;
    updateQuantity(req: any, productId: string, dto: {
        quantity: number;
    }): Promise<{
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
    remove(req: any, productId: string): Promise<{
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
    clear(req: any): Promise<{
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
export {};
