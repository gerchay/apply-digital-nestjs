import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listado público de productos',
    description:
      'Devuelve productos no eliminados con paginación y filtros por nombre, categoría y rango de precio.',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 5 })
  @ApiQuery({ name: 'name', required: false, example: 'Makita' })
  @ApiQuery({ name: 'category', required: false, example: 'Tools' })
  @ApiQuery({ name: 'minPrice', required: false, example: 10 })
  @ApiQuery({ name: 'maxPrice', required: false, example: 100 })
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Eliminar un producto',
    description:
      'Marca un producto como eliminado. Requiere JWT y el producto no volverá a aparecer en listados ni tras resync.',
  })
  async softDelete(@Param('id') id: string) {
    return this.productsService.softDeleteById(id);
  }
}
