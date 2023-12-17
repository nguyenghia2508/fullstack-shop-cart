import mongoose, { Document, Schema, Model } from 'mongoose';

interface ProductImage {
  path: string;
  name: string;
  imageType: string;
}

interface CartItem extends Document {
  productName: string;
  productNumber: number;
  productPrice: number;
  productImage: ProductImage;
}

export interface IUserCart extends Document {
  username: string;
  carts: CartItem[];
}

const productImageSchema: Schema<ProductImage> = new Schema<ProductImage>({
  path: {
    type: String,
  },
  name: {
    type: String,
  },
  imageType: {
    type: String,
  },
});

const cartItemSchema: Schema<CartItem> = new Schema<CartItem>({
  productName: {
    type: String,
  },
  productNumber: {
    type: Number,
  },
  productPrice: {
    type: Number,
  },
  productImage: productImageSchema,
});

const userCartSchema: Schema<IUserCart> = new Schema<IUserCart>({
  username: {
    type: String,
  },
  carts: [cartItemSchema],
});

const UserCart: Model<IUserCart> = mongoose.model<IUserCart>('UserCart', userCartSchema);

export default UserCart;
