"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopService = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("../products/products.service");
const categories_service_1 = require("../categories/categories.service");
let ShopService = class ShopService {
    productsService;
    categoriesService;
    constructor(productsService, categoriesService) {
        this.productsService = productsService;
        this.categoriesService = categoriesService;
    }
    async searchProducts(query, filters) {
        return this.productsService.searchProducts(query, filters);
    }
    async getFeaturedProducts() {
        return this.productsService.getFeaturedProducts();
    }
    async getProductsByCategory(categoryId) {
        return this.productsService.getProductsByCategory(categoryId);
    }
    async getCategories() {
        return this.categoriesService.findAll();
    }
    async getRegions() {
        const products = await this.productsService.findActiveProducts();
        const regions = [...new Set(products.map(p => p.region))].filter(Boolean);
        return regions.sort();
    }
};
exports.ShopService = ShopService;
exports.ShopService = ShopService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        categories_service_1.CategoriesService])
], ShopService);
//# sourceMappingURL=shop.service.js.map