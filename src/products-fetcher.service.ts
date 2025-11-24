/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsFetcherService {
  private readonly logger = new Logger(ProductsFetcherService.name);

  constructor(private readonly httpService: HttpService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async fetchProductsHourly(): Promise<void> {
    const spaceId = process.env.CONTENTFUL_SPACE_ID!;
    const envId = process.env.CONTENTFUL_ENVIRONMENT!;
    const contentType = process.env.CONTENTFUL_CONTENT_TYPE!;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN!;
    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries?access_token=${accessToken}&content_type=${contentType}`;

    try {
      const response$ = this.httpService.get(url, {});
      const { data } = await firstValueFrom(response$);

      this.logger.log('📦 Productos recibidos desde Contentful:');
      console.log(JSON.stringify(data, null, 2));
    } catch (error: any) {
      this.logger.error(
        `Error consultando Contentful: ${error.message ?? error}`,
      );
    }
  }
}
