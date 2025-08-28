import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    addToFavorites(productId: string, req: any): Promise<{
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
    removeFromFavorites(productId: string, req: any): Promise<{
        message: string;
    }>;
    getUserFavorites(req: any): Promise<({
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
    checkIfFavorite(productId: string, req: any): Promise<{
        isFavorite: boolean;
    }>;
}
