import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Query('page') page = '1',
    @Query('limit') limit = '5',
    @Query('name') name?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);

    let limitNum = parseInt(limit, 10) || 5;
    if (limitNum > 5) limitNum = 5;
    if (limitNum < 1) limitNum = 1;

    const minPriceNum = minPrice !== undefined ? Number(minPrice) : undefined;
    const maxPriceNum = maxPrice !== undefined ? Number(maxPrice) : undefined;

    return this.productsService.findAll({
      page: pageNum,
      limit: limitNum,
      name,
      category,
      minPrice: isNaN(minPriceNum as number) ? undefined : minPriceNum,
      maxPrice: isNaN(maxPriceNum as number) ? undefined : maxPriceNum,
    });
  }
}
