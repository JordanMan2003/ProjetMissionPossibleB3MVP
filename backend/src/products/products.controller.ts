import { Body, Controller, Get, Post, Req, UseGuards, Query, Param, Put, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength, Max } from 'class-validator';

class CreateProductDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  originalPrice: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsString()
  type: string;

  @IsString()
  region: string;

  @IsString()
  producer: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reviews?: number;

  @IsOptional()
  solidaire?: boolean;

  @IsString()
  distance: string;

  @IsOptional()
  isRestaurant?: boolean;

  @IsOptional()
  @IsString()
  expiryNote?: string;

  @IsOptional()
  contents?: Array<{ item: string; emoji: string; order: number }>;
}

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async listAll(
    @Query('type') type?: string,
    @Query('region') region?: string,
    @Query('solidaire') solidaire?: string,
    @Query('search') search?: string,
  ) {
    const filters = {
      type,
      region,
      solidaire: solidaire === 'true',
      search,
    };
    return this.productsService.listAll(filters);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() dto: CreateProductDto) {
    return this.productsService.createProduct(req.user.userId, dto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.productsService.getById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: Partial<CreateProductDto>) {
    return this.productsService.updateProduct(req.user.userId, id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.productsService.deleteProduct(req.user.userId, id);
  }
}

