import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true })
  contentfulId: string;

  @Prop({ required: true, unique: true })
  sku: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  brand?: string;

  @Prop()
  model?: string;

  @Prop()
  category?: string;

  @Prop()
  color?: string;

  @Prop()
  price?: number;

  @Prop()
  currency?: string;

  @Prop()
  stock?: number;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ type: Object })
  raw?: any;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
