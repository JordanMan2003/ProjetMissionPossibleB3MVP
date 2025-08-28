import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { CartService } from './cart.service';

class AddItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  get(@Req() req: any) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('items')
  add(@Req() req: any, @Body() dto: AddItemDto) {
    return this.cartService.addItem(req.user.userId, dto.productId, dto.quantity);
  }

  @Put('items/:productId')
  updateQuantity(@Req() req: any, @Param('productId') productId: string, @Body() dto: { quantity: number }) {
    return this.cartService.setItemQuantity(req.user.userId, productId, dto.quantity);
  }

  @Delete('items/:productId')
  remove(@Req() req: any, @Param('productId') productId: string) {
    return this.cartService.removeItem(req.user.userId, productId);
  }

  @Delete()
  clear(@Req() req: any) {
    return this.cartService.clearCart(req.user.userId);
  }
}

