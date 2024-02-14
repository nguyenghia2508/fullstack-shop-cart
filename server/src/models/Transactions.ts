import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITransaction extends Document {
    listProduct: string;
}

const transactionSchema: Schema<ITransaction> = new Schema<ITransaction>({
    listProduct: {
        type: String,
    },
});

const Transactions: Model<ITransaction> = mongoose.model<ITransaction>('Transactions', transactionSchema);

export default Transactions;
