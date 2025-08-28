import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listAll(filters?: {
        type?: string;
        region?: string;
        solidaire?: boolean;
        search?: string;
    }): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        } | null;
        owner: {
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
    createProduct(ownerId: string, data: {
        name: string;
        description: string;
        price: number;
        originalPrice: number;
        stock: number;
        imageUrl?: string;
        categoryId?: string;
        type: string;
        region: string;
        producer: string;
        rating?: number;
        reviews?: number;
        solidaire?: boolean;
        distance: string;
        isRestaurant?: boolean;
        expiryNote?: string;
        contents?: Array<{
            item: string;
            emoji: string;
            order: number;
        }>;
    }): Promise<{
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
    }>;
    getById(id: string): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        } | null;
        owner: {
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
    }) | null>;
    updateProduct(ownerId: string, id: string, data: Partial<{
        name: string;
        description: string;
        price: number;
        originalPrice: number;
        stock: number;
        imageUrl?: string;
        categoryId?: string;
        type: string;
        region: string;
        producer: string;
        rating?: number;
        reviews?: number;
        solidaire?: boolean;
        distance: string;
        isRestaurant?: boolean;
        expiryNote?: string;
        contents?: Array<{
            item: string;
            emoji: string;
            order: number;
        }>;
    }>): Promise<{
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
    }>;
    deleteProduct(ownerId: string, id: string): Promise<{
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
    findAll(): Promise<({
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
    findActiveProducts(): Promise<({
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
    searchProducts(query: string, filters?: {
        type?: string;
        region?: string;
        solidaire?: boolean;
        categoryId?: string;
    }): Promise<({
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
}
