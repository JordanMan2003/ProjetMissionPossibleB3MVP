import { PrismaService } from '../prisma/prisma.service';
export declare class FavoritesService {
    private prisma;
    constructor(prisma: PrismaService);
    addToFavorites(userId: string, productId: string): Promise<{
        product: {
            owner: {
                id: string;
                fullName: string;
            };
            contents: {
                id: string;
                productId: string;
                item: string;
                emoji: string;
                order: number;
            }[];
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
        };
    } & {
        id: string;
        createdAt: Date;
        productId: string;
        userId: string;
    }>;
    removeFromFavorites(userId: string, productId: string): Promise<{
        message: string;
    }>;
    getUserFavorites(userId: string): Promise<({
        product: {
            owner: {
                id: string;
                fullName: string;
            };
            contents: {
                id: string;
                productId: string;
                item: string;
                emoji: string;
                order: number;
            }[];
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
        };
    } & {
        id: string;
        createdAt: Date;
        productId: string;
        userId: string;
    })[]>;
    isProductFavorite(userId: string, productId: string): Promise<boolean>;
}
