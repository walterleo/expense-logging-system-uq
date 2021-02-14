import { model } from 'mongoose';
import { categoryMongoSchema } from './category.schema';
const CategoryModel = model('category', categoryMongoSchema);

export default CategoryModel;
