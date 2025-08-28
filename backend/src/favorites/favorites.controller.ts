import { Controller, Post, Delete, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';

@ApiTags('favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':productId')
  async addToFavorites(@Param('productId') productId: string, @Req() req: any) {
    return this.favoritesService.addToFavorites(req.user.userId, productId);
  }

  @Delete(':productId')
  async removeFromFavorites(@Param('productId') productId: string, @Req() req: any) {
    return this.favoritesService.removeFromFavorites(req.user.userId, productId);
  }

  @Get()
  async getUserFavorites(@Req() req: any) {
    return this.favoritesService.getUserFavorites(req.user.userId);
  }

  @Get('check/:productId')
  async checkIfFavorite(@Param('productId') productId: string, @Req() req: any) {
    const isFavorite = await this.favoritesService.isProductFavorite(req.user.userId, productId);
    return { isFavorite };
  }
}
