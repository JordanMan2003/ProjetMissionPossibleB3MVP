import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, AccountStatus, OrderStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Dashboard statistics
  async getDashboardStats() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingUsers,
      activeProducts,
      pendingOrders
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: { status: 'PAID' },
        _sum: { total: true }
      }),
      this.prisma.user.count({
        where: { accountStatus: 'PENDING' }
      }),
      this.prisma.product.count({
        where: { stock: { gt: 0 } }
      }),
      this.prisma.order.count({
        where: { status: 'PENDING' }
      })
    ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingUsers,
      activeProducts,
      pendingOrders,
      // Calculate growth percentages (mock data for now)
      userGrowth: 12,
      productGrowth: 8,
      orderGrowth: 15,
      revenueGrowth: 23
    };
  }

  // User management
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        accountStatus: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            products: true,
            orders: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateUserStatus(userId: string, status: AccountStatus) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { accountStatus: status },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        accountStatus: true,
        createdAt: true
      }
    });
  }

  async deleteUser(userId: string) {
    return this.prisma.user.delete({
      where: { id: userId }
    });
  }

  // Product management
  async getAllProducts() {
    return this.prisma.product.findMany({
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateProductStatus(productId: string, isActive: boolean) {
    return this.prisma.product.update({
      where: { id: productId },
      data: { stock: isActive ? 1 : 0 }, // Simple way to mark as active/inactive
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  async deleteProduct(productId: string) {
    return this.prisma.product.delete({
      where: { id: productId }
    });
  }

  // Order management
  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        }
      }
    });
  }

  // Category management
  async getAllCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async createCategory(data: { name: string; slug: string }) {
    return this.prisma.category.create({
      data,
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });
  }

  async updateCategory(categoryId: string, data: { name: string; slug: string }) {
    return this.prisma.category.update({
      where: { id: categoryId },
      data,
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });
  }

  async deleteCategory(categoryId: string) {
    return this.prisma.category.delete({
      where: { id: categoryId }
    });
  }

  // Sales reports
  async getSalesReport(startDate: string, endDate: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        },
        status: 'PAID'
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const totalOrders = orders.length;

    return {
      orders,
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
    };
  }
}
