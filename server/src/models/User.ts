import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  fullname: string;
  role:number;
  username: string;
  email: string;
  password: string;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  fullname: {
    type: String,
  },
  role:{
    type:Number,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
