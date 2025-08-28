import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountStatus, UserRole } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async listAll(filters?: {
    type?: string;
    region?: string;
    solidaire?: boolean;
    search?: string;
  }) {
    const where: any = {};
    
    if (filters?.type && filters.type !== 'all') {
      where.type = filters.type;
    }
    
    if (filters?.region && filters.region !== 'all') {
      where.region = filters.region;
    }
    
    if (filters?.solidaire) {
      where.solidaire = true;
    }
    
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { producer: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.findMany({ 
      where,
      include: { 
        category: true, 
        owner: true,
        contents: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createProduct(ownerId: string, data: { 
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
    contents?: Array<{ item: string; emoji: string; order: number }>;
  }) {
    const owner = await this.prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner || (owner.role !== UserRole.PRODUCER && owner.role !== UserRole.RESTAURANT)) {
      throw new ForbiddenException('Only producers or restaurants can create products');
    }
    if (owner.accountStatus !== AccountStatus.APPROVED) {
      throw new ForbiddenException('Account not approved');
    }
    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice,
        stock: data.stock,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        type: data.type,
        region: data.region,
        producer: data.producer,
        rating: data.rating || 0,
        reviews: data.reviews || 0,
        solidaire: data.solidaire || false,
        distance: data.distance,
        isRestaurant: data.isRestaurant || false,
        expiryNote: data.expiryNote,
        ownerId,
        contents: data.contents ? {
          create: data.contents
        } : undefined,
      },
      include: {
        contents: {
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  async getById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        contents: { orderBy: { order: 'asc' } },
        category: true,
        owner: true,
      },
    });
  }

  async updateProduct(ownerId: string, id: string, data: Partial<{ 
    name: string; description: string; price: number; originalPrice: number; stock: number; imageUrl?: string; categoryId?: string;
    type: string; region: string; producer: string; rating?: number; reviews?: number; solidaire?: boolean; distance: string; isRestaurant?: boolean; expiryNote?: string;
    contents?: Array<{ item: string; emoji: string; order: number }>
  }>) {
    const owner = await this.prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner || (owner.role !== UserRole.PRODUCER && owner.role !== UserRole.RESTAURANT)) {
      throw new ForbiddenException('Only producers or restaurants can update products');
    }
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product || product.ownerId !== ownerId) {
      throw new ForbiddenException('Not allowed');
    }
    return this.prisma.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.price !== undefined ? { price: data.price } : {}),
        ...(data.originalPrice !== undefined ? { originalPrice: data.originalPrice } : {}),
        ...(data.stock !== undefined ? { stock: data.stock } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
        ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.region !== undefined ? { region: data.region } : {}),
        ...(data.producer !== undefined ? { producer: data.producer } : {}),
        ...(data.rating !== undefined ? { rating: data.rating } : {}),
        ...(data.reviews !== undefined ? { reviews: data.reviews } : {}),
        ...(data.solidaire !== undefined ? { solidaire: data.solidaire } : {}),
        ...(data.distance !== undefined ? { distance: data.distance } : {}),
        ...(data.isRestaurant !== undefined ? { isRestaurant: data.isRestaurant } : {}),
        ...(data.expiryNote !== undefined ? { expiryNote: data.expiryNote } : {}),
        // contents update logic could be added if needed
      },
      include: { contents: { orderBy: { order: 'asc' } } },
    });
  }

  async deleteProduct(ownerId: string, id: string) {
    const owner = await this.prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner || (owner.role !== UserRole.PRODUCER && owner.role !== UserRole.RESTAURANT)) {
      throw new ForbiddenException('Only producers or restaurants can delete products');
    }
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product || product.ownerId !== ownerId) {
      throw new ForbiddenException('Not allowed');
    }
    return this.prisma.product.delete({ where: { id } });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        contents: {
          orderBy: { order: 'asc' },
        },
        owner: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      where: {
        isActive: true, // Seulement les produits actifs
        stock: { gt: 0 }, // Seulement les produits en stock
      },
      orderBy: [
        { featured: 'desc' }, // Produits mis en avant en premier
        { createdAt: 'desc' }, // Puis par date de création
      ],
    });
  }

  async findActiveProducts() {
    return this.prisma.product.findMany({
      include: {
        contents: {
          orderBy: { order: 'asc' },
        },
        owner: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      where: {
        isActive: true,
        stock: { gt: 0 },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async searchProducts(query: string, filters?: {
    type?: string;
    region?: string;
    solidaire?: boolean;
    categoryId?: string;
  }) {
    const where: any = {
      isActive: true,
      stock: { gt: 0 },
    };

    // Filtres
    if (filters?.type && filters.type !== 'all') {
      where.type = filters.type;
    }
    if (filters?.region && filters.region !== 'all') {
      where.region = filters.region;
    }
    if (filters?.solidaire) {
      where.solidaire = true;
    }
    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    // Recherche textuelle
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { producer: { contains: query, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.findMany({
      where,
      include: {
        contents: {
          orderBy: { order: 'asc' },
        },
        owner: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async getFeaturedProducts() {
    return this.prisma.product.findMany({
      where: {
        featured: true,
        isActive: true,
        stock: { gt: 0 },
      },
      include: {
        contents: {
          orderBy: { order: 'asc' },
        },
        owner: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 8, // Limiter à 8 produits mis en avant
    });
  }

  async getProductsByCategory(categoryId: string) {
    return this.prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
        stock: { gt: 0 },
      },
      include: {
        contents: {
          orderBy: { order: 'asc' },
        },
        owner: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }
}

