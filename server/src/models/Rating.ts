import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReview extends Document {
  userReview: string;
  reviewPost: string;
  rating: number;
  date: string;
}

export interface IRating extends Document {
  productId: string;
  productName: string;
  listReview: IReview[];
}

const reviewSchema: Schema<IReview> = new Schema<IReview>({
  userReview: {
    type: String,
  },
  reviewPost: {
    type: String,
  },
  rating: {
    type: Number,
  },
  date: {
    type: String,
  },
});

const ratingSchema: Schema<IRating> = new Schema<IRating>({
  productId: {
    type: String,
  },
  productName: {
    type: String,
  },
  listReview: [reviewSchema],
});

const Rating: Model<IRating> = mongoose.model<IRating>('Rating', ratingSchema);

export default Rating;
