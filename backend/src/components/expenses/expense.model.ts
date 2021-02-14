import { model } from 'mongoose';
import { expenseMongoSchema } from './expense.schema';

const ExpenseModel = model('expense', expenseMongoSchema);

export default ExpenseModel;
