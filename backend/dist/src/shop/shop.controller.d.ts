import { ShopService } from './shop.service';
export declare class ShopController {
    private readonly shopService;
    constructor(shopService: ShopService);
    getProducts(search?: string, type?: string, region?: string, solidaire?: boolean, categoryId?: string): Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
        owner: {
            id: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
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
    })[]>;
    getFeaturedProducts(): Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
        owner: {
            id: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
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
    })[]>;
    getProductsByCategory(categoryId: string): Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
        owner: {
            id: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
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
    })[]>;
    getCategories(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    }[]>;
    getRegions(): Promise<string[]>;
}
