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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shop_service_1 = require("./shop.service");
let ShopController = class ShopController {
    shopService;
    constructor(shopService) {
        this.shopService = shopService;
    }
    async getProducts(search, type, region, solidaire, categoryId) {
        const filters = { type, region, solidaire, categoryId };
        return this.shopService.searchProducts(search || '', filters);
    }
    async getFeaturedProducts() {
        return this.shopService.getFeaturedProducts();
    }
    async getProductsByCategory(categoryId) {
        return this.shopService.getProductsByCategory(categoryId);
    }
    async getCategories() {
        return this.shopService.getCategories();
    }
    async getRegions() {
        return this.shopService.getRegions();
    }
};
exports.ShopController = ShopController;
__decorate([
    (0, common_1.Get)('products'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('region')),
    __param(3, (0, common_1.Query)('solidaire')),
    __param(4, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Boolean, String]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('products/featured'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "getFeaturedProducts", null);
__decorate([
    (0, common_1.Get)('products/category/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "getProductsByCategory", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('regions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShopController.prototype, "getRegions", null);
exports.ShopController = ShopController = __decorate([
    (0, swagger_1.ApiTags)('shop'),
    (0, common_1.Controller)('shop'),
    __metadata("design:paramtypes", [shop_service_1.ShopService])
], ShopController);
//# sourceMappingURL=shop.controller.js.map