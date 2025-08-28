import { Controller, Get, Put, Delete, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole, AccountStatus, OrderStatus } from '@prisma/client';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // User management
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('users/:id/status')
  async updateUserStatus(
    @Param('id') userId: string,
    @Body() body: { status: AccountStatus }
  ) {
    return this.adminService.updateUserStatus(userId, body.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('users/:id')
  async deleteUser(@Param('id') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  // Product management
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('products')
  async getAllProducts() {
    return this.adminService.getAllProducts();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('products/:id/status')
  async updateProductStatus(
    @Param('id') productId: string,
    @Body() body: { isActive: boolean }
  ) {
    return this.adminService.updateProductStatus(productId, body.isActive);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('products/:id')
  async deleteProduct(@Param('id') productId: string) {
    return this.adminService.deleteProduct(productId);
  }

  // Order management
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('orders')
  async getAllOrders() {
    return this.adminService.getAllOrders();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('orders/:id/status')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() body: { status: OrderStatus }
  ) {
    return this.adminService.updateOrderStatus(orderId, body.status);
  }

  // Category management
  @Get('categories')
  async getAllCategories() {
    return this.adminService.getAllCategories();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('categories')
  async createCategory(@Body() data: { name: string; slug: string }) {
    return this.adminService.createCategory(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('categories/:id')
  async updateCategory(
    @Param('id') categoryId: string,
    @Body() data: { name: string; slug: string }
  ) {
    return this.adminService.updateCategory(categoryId, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('categories/:id')
  async deleteCategory(@Param('id') categoryId: string) {
    return this.adminService.deleteCategory(categoryId);
  }

  // Reports
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('reports/sales')
  async getSalesReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.adminService.getSalesReport(startDate, endDate);
  }
}
