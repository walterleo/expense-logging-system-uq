// category.service.ts
/**
 * This is the doc comment for category.service.ts
 * @packageDocumentation
 * @module categoryService
 */

import BaseService from '../../http/service/base.service';
import ExpenseService from '../expenses/expense.service';
import CategoryRepository from './category.repository';
import CategoryInterface from './category.interface';

const expenseService = ExpenseService.getInstance();

/**
 * This is the class service of category that extend of the base service
 */

class CategoryService extends BaseService<CategoryInterface> {
    private static instance: CategoryService;

    /**
     * Constructor of category service, instance the category repository and
     * send it to the baseService
     */

    private constructor() {
      super({
        repository: CategoryRepository.getInstance(),
      });
    }

    /**
     * Method to instance the categoryService
     * @returns The instance of the categoryService
     */

    public static getInstance(): CategoryService {
      if (!CategoryService.instance) {
        CategoryService.instance = new CategoryService();
      }

      return CategoryService.instance;
    }

    /**
     * Method to delete one category and delete all expenses related it
     * @param id Id of category to delete
     * @returns a promise with the information of delete process
     */

    async deleteOne(id: string) {
      await expenseService.deleteManyByCategoryId(id);
      return this.repository.deleteOne({ _id: id });
    }
}

export default CategoryService;
