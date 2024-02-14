import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User, { IUser } from './models/User';

dotenv.config();

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ username: 'admin' });

    if (!existingAdmin) {
      const newAdmin: IUser = new User({
        username: 'admin',
        email: 'binlatao5@gmail.com',
        password: process.env.PASSWORD,
        fullname: 'Admin',
        role: 0,
      });

      await newAdmin.save();
    }
  } catch (error) {
    console.error('Error seeding admin account', error);
  }
};

seedAdmin();

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ShopCart?readPreference=primary&directConnection=true&ssl=false';

const mongooseOptions: mongoose.ConnectOptions = {
  autoIndex: false,
  autoCreate: true,
};

mongoose.connect(connectionString, mongooseOptions);

mongoose.connection.on('connected', () => {
  console.log(`Connect db success to ${process.env.MONGODB_URI ? 'production' : 'development'}`);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
