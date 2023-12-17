import mongoose, { Document, Schema, Model } from 'mongoose';

interface ProductImage {
  path: string;
  name: string;
  imageType: string;
}

interface CartItem {
  productName: string;
  productNumber: number;
  productPrice: number;
  productImage: ProductImage;
}

export interface IBill extends Document {
  username: string;
  address: string;
  city: string;
  emailReceive: string;
  dateCreate: string;
  telephone: string;
  notes: string;
  methodPay: string;
  carts: CartItem[];
  totalNumber: number;
  totalPrice: number;
}

const billSchema: Schema<IBill> = new Schema<IBill>({
  username: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  emailReceive: {
    type: String,
  },
  dateCreate: {
    type: String,
  },
  telephone: {
    type: String,
  },
  notes: {
    type: String,
  },
  methodPay: {
    type: String,
  },
  carts: [
    {
      productName: {
        type: String,
      },
      productNumber: {
        type: Number,
      },
      productPrice: {
        type: Number,
      },
      productImage: {
        path: String,
        name: String,
        imageType: String,
      },
    },
  ],
  totalNumber: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
});

const Bill: Model<IBill> = mongoose.model<IBill>('Bill', billSchema);

export default Bill;
