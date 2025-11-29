import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('deleted-percentage')
  async getDeletedPercentage() {
    return this.reportsService.getDeletedPercentage();
  }

  @UseGuards(JwtAuthGuard)
  @Get('non-deleted-price-status')
  async getNonDeletedPriceStatus() {
    return this.reportsService.getNonDeletedPriceStatus();
  }

  @UseGuards(JwtAuthGuard)
  @Get('date-range')
  async getByDateRange(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('field') field: 'createdAt' | 'updatedAt' = 'createdAt',
  ) {
    return this.reportsService.getByDateRange({ start, end, field });
  }

  @UseGuards(JwtAuthGuard)
  @Get('top-categories')
  async getTopCategories(@Query('limit') limit = '5') {
    const parsedLimit = parseInt(limit, 10);
    const safeLimit =
      Number.isNaN(parsedLimit) || parsedLimit <= 0 ? 5 : parsedLimit;

    return this.reportsService.getTopCategories(safeLimit);
  }
}
