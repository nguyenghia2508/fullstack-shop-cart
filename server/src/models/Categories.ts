import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICategory extends Document {
    typeProduct:String
}

const categorySchema: Schema<ICategory> = new Schema<ICategory>({
    typeProduct:{
        type:String
    }
});

const Categories: Model<ICategory> = mongoose.model<ICategory>('Categories', categorySchema);

export default Categories;
