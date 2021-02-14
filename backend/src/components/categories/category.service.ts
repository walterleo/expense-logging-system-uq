import BaseService from '../../http/service/base.service';
import ExpenseService from '../expenses/expense.service';
import CategoryRepository from './category.repository';
import CategoryInterface from './category.interface';

const expenseService = ExpenseService.getInstance();

class CategoryService extends BaseService<CategoryInterface> {
    private static instance: CategoryService;

    private constructor() {
      super({
        repository: CategoryRepository.getInstance(),
      });
    }

    public static getInstance(): CategoryService {
      if (!CategoryService.instance) {
        CategoryService.instance = new CategoryService();
      }

      return CategoryService.instance;
    }

    async deleteOne(id: string) {
        console.log('deleteOne category');
        await expenseService.deleteManyByCategoryId(id);
      return this.repository.deleteOne({ _id: id });
    }
}

export default CategoryService;
