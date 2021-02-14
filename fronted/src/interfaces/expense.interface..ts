import CategoryInterface from '@/interfaces/category.interface';

export default interface ExpenseInterface {
  id?: string;
  description?: string;
  amount: number;
  categoryId: string;
  category?: CategoryInterface;
  createdAt?: Date;
  updatedAt?: Date;
};
