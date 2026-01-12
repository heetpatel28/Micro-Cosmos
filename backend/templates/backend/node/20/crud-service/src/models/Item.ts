import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  description?: string;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Item = mongoose.model<IItem>('Item', ItemSchema);

