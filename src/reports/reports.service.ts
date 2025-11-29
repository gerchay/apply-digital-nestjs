/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Product, ProductDocument } from '../products/product.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async getDeletedPercentage() {
    const total = await this.productModel.countDocuments();

    if (total === 0) {
      return {
        total,
        deletedCount: 0,
        deletedPercentage: 0,
      };
    }

    const deletedCount = await this.productModel.countDocuments({
      deleted: true,
    });

    const deletedPercentage = Number(((deletedCount * 100) / total).toFixed(2));

    return {
      total,
      deletedCount,
      deletedPercentage,
    };
  }

  async getNonDeletedPriceStatus() {
    const totalActive = await this.productModel.countDocuments({
      deleted: false,
    });

    if (totalActive === 0) {
      return {
        totalActive,
        withPriceCount: 0,
        withoutPriceCount: 0,
        withPricePercentage: 0,
        withoutPricePercentage: 0,
      };
    }

    const withPriceCount = await this.productModel.countDocuments({
      deleted: false,
      price: { $exists: true },
    });

    const withoutPriceCount = totalActive - withPriceCount;

    const withPricePercentage = Number(
      ((withPriceCount * 100) / totalActive).toFixed(2),
    );

    const withoutPricePercentage = Number(
      ((withoutPriceCount * 100) / totalActive).toFixed(2),
    );

    return {
      totalActive,
      withPriceCount,
      withoutPriceCount,
      withPricePercentage,
      withoutPricePercentage,
    };
  }

  async getByDateRange(params: {
    start: string;
    end: string;
    field?: 'createdAt' | 'updatedAt';
  }) {
    const { start, end, field = 'createdAt' } = params;

    if (!start || !end) {
      throw new BadRequestException('start and end dates are required');
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (endDate < startDate) {
      throw new BadRequestException('end date must be after start date');
    }

    const baseFilter: FilterQuery<ProductDocument> = {
      deleted: false,
    };

    const dateFilter: FilterQuery<ProductDocument> = {
      ...baseFilter,
      [field]: { $gte: startDate, $lte: endDate },
    };

    const totalActive = await this.productModel.countDocuments(baseFilter);
    const inRangeCount = await this.productModel.countDocuments(dateFilter);

    const inRangePercentage =
      totalActive === 0
        ? 0
        : Number(((inRangeCount * 100) / totalActive).toFixed(2));

    return {
      field,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      totalActive,
      inRangeCount,
      inRangePercentage,
    };
  }

  async getTopCategories(limit = 5) {
    const baseFilter: FilterQuery<ProductDocument> = {
      deleted: false,
    };

    const totalActive = await this.productModel.countDocuments(baseFilter);

    if (totalActive === 0) {
      return {
        totalActive,
        categories: [],
      };
    }

    const rawResult = await this.productModel.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    const categories = rawResult.map((item: any) => {
      const category = item._id ?? 'Unknown';
      const count = item.count ?? 0;
      const avgPrice =
        typeof item.avgPrice === 'number'
          ? Number(item.avgPrice.toFixed(2))
          : null;

      const percentage = Number(((count * 100) / totalActive).toFixed(2));

      return {
        category,
        count,
        avgPrice,
        percentage,
      };
    });

    return {
      totalActive,
      categories,
    };
  }
}
