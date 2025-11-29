import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    ProductsModule,
    AuthModule,
    ReportsModule,
  ],
})
export class AppModule {}
