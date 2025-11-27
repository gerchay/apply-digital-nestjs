/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductsFetcherService {
  private readonly logger = new Logger(ProductsFetcherService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchProductsHourly(): Promise<void> {
    const spaceId = process.env.CONTENTFUL_SPACE_ID!;
    const envId = process.env.CONTENTFUL_ENVIRONMENT!;
    const contentType = process.env.CONTENTFUL_CONTENT_TYPE!;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN!;
    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries?access_token=${accessToken}&content_type=${contentType}`;

    try {
      const response$ = this.httpService.get(url, {});
      const { data } = await firstValueFrom(response$);

      this.logger.log(`Productos recibidos: ${data.items?.length ?? 0}`);

      for (const item of data.items ?? []) {
        const contentfulId = item.sys?.id as string;

        const fields = item.fields ?? {};

        const sku = fields.sku as number | undefined;
        const name = fields.name as string | undefined;
        const brand = fields.brand as string | undefined;
        const model = fields.model as string | undefined;
        const category = fields.category as string | undefined;
        const color = fields.color as string | undefined;
        const price = fields.price as number | undefined;
        const currency = fields.currency as string | undefined;
        const stock = fields.stock as number | undefined;

        await this.productModel.updateOne(
          { contentfulId },
          {
            $set: {
              contentfulId,
              sku,
              name,
              brand,
              model,
              category,
              color,
              price,
              currency,
              stock,
              raw: item,
            },
          },
          { upsert: true },
        );
      }

      this.logger.log(
        `Sync completado a las ${new Date().toLocaleTimeString()}`,
      );
    } catch (error: any) {
      this.logger.error(
        `Error consultando Contentful: ${error.message ?? error}`,
      );
    }
  }
}
