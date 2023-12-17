import mongoose, { Document, Schema, Model } from 'mongoose';

interface ProductImage {
  path: string;
  name: string;
  imageType: string;
}

export interface IProduct extends Document {
  name: string;
  number: number;
  price: number;
  date: string;
  category: string;
  desc: string;
  detail: string;
  image: ProductImage;
  totalSold: number;
}

const productSchema: Schema<IProduct> = new Schema<IProduct>({
  name: {
    type: String,
  },
  number: {
    type: Number,
  },
  price: {
    type: Number,
  },
  date: {
    type: String,
  },
  category: {
    type: String,
  },
  desc: {
    type: String,
  },
  detail: {
    type: String,
  },
  image: {
    path: String,
    name: String,
    imageType: String,
  },
  totalSold: {
    type: Number,
  },
});

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);

export default Product;
