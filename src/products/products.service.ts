/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

interface FindAllParams {
  page: number;
  limit: number;
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async findAll(params: FindAllParams) {
    const { page, limit, name, category, minPrice, maxPrice } = params;

    const filter: FilterQuery<ProductDocument> = {
      deleted: false,
    };

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        filter.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = maxPrice;
      }
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.productModel.countDocuments(filter),
    ]);

    const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
