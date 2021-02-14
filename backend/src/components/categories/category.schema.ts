import { Schema } from 'mongoose';

const categoryMongoSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
});

categoryMongoSchema.set('toJSON', {
  virtuals: true,
});

export { categoryMongoSchema };
