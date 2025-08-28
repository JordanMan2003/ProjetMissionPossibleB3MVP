import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShopService } from './shop.service';

@ApiTags('shop')
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('products')
  async getProducts(
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('region') region?: string,
    @Query('solidaire') solidaire?: boolean,
    @Query('categoryId') categoryId?: string,
  ) {
    const filters = { type, region, solidaire, categoryId };
    return this.shopService.searchProducts(search || '', filters);
  }

  @Get('products/featured')
  async getFeaturedProducts() {
    return this.shopService.getFeaturedProducts();
  }

  @Get('products/category/:categoryId')
  async getProductsByCategory(@Param('categoryId') categoryId: string) {
    return this.shopService.getProductsByCategory(categoryId);
  }

  @Get('categories')
  async getCategories() {
    return this.shopService.getCategories();
  }

  @Get('regions')
  async getRegions() {
    return this.shopService.getRegions();
  }
}
