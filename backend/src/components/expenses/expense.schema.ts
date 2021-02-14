import { Schema } from 'mongoose';
import idValidator = require('mongoose-id-validator');

const expenseMongoSchema = new Schema({
  description: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    require: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
}, { timestamps: true });

expenseMongoSchema.virtual('category', {
  ref: 'category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});

expenseMongoSchema.set('toJSON', {
  virtuals: true,
});

expenseMongoSchema.plugin(idValidator);

export { expenseMongoSchema };
