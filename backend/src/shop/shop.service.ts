import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ShopService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async searchProducts(query: string, filters?: {
    type?: string;
    region?: string;
    solidaire?: boolean;
    categoryId?: string;
  }) {
    return this.productsService.searchProducts(query, filters);
  }

  async getFeaturedProducts() {
    return this.productsService.getFeaturedProducts();
  }

  async getProductsByCategory(categoryId: string) {
    return this.productsService.getProductsByCategory(categoryId);
  }

  async getCategories() {
    return this.categoriesService.findAll();
  }

  async getRegions() {
    // Récupérer toutes les régions uniques depuis les produits
    const products = await this.productsService.findActiveProducts();
    const regions = [...new Set(products.map(p => p.region))].filter(Boolean);
    return regions.sort();
  }
}
