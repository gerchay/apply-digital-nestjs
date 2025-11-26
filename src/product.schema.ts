import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true })
  contentfulId: string; // sys.id de Contentful

  @Prop({ required: true, unique: true })
  sku: number; // fields.sku

  @Prop({ required: true })
  name: string; // fields.name

  @Prop()
  brand?: string; // fields.brand

  @Prop()
  model?: string; // fields.model

  @Prop()
  category?: string; // fields.category

  @Prop()
  color?: string; // fields.color

  @Prop()
  price?: number; // fields.price

  @Prop()
  currency?: string; // fields.currency

  @Prop()
  stock?: number; // fields.stock

  @Prop({ default: false })
  deleted: boolean; // para el soft delete después

  @Prop({ type: Object })
  raw?: any; // guardamos el item completo por si hace falta para reportes
}

export const ProductSchema = SchemaFactory.createForClass(Product);
