import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('reports')
@ApiBearerAuth('jwt')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('deleted-percentage')
  @ApiOperation({
    summary: 'Porcentaje de productos eliminados',
  })
  async getDeletedPercentage() {
    return this.reportsService.getDeletedPercentage();
  }

  @UseGuards(JwtAuthGuard)
  @Get('non-deleted-price-status')
  @ApiOperation({
    summary:
      'Estado de precios de productos no eliminados (con precio / sin precio)',
  })
  async getNonDeletedPriceStatus() {
    return this.reportsService.getNonDeletedPriceStatus();
  }

  @UseGuards(JwtAuthGuard)
  @Get('date-range')
  @ApiOperation({
    summary:
      'Productos no eliminados en un rango de fechas (createdAt/updatedAt)',
  })
  @ApiQuery({ name: 'start', required: true, example: '2025-01-01' })
  @ApiQuery({ name: 'end', required: true, example: '2025-12-31' })
  @ApiQuery({
    name: 'field',
    required: false,
    example: 'createdAt',
    description: 'Campo a usar: createdAt o updatedAt',
  })
  async getByDateRange(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('field') field: 'createdAt' | 'updatedAt' = 'createdAt',
  ) {
    return this.reportsService.getByDateRange({ start, end, field });
  }

  @UseGuards(JwtAuthGuard)
  @Get('top-categories')
  @ApiOperation({
    summary:
      'Top categorías por cantidad de productos, con promedio de precio y porcentaje sobre el total',
  })
  @ApiQuery({ name: 'limit', required: false, example: 5 })
  async getTopCategories(@Query('limit') limit = '5') {
    const parsedLimit = parseInt(limit, 10);
    const safeLimit =
      Number.isNaN(parsedLimit) || parsedLimit <= 0 ? 5 : parsedLimit;

    return this.reportsService.getTopCategories(safeLimit);
  }
}
