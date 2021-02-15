// expense.service.ts
/**
 * This is the doc comment for expense.service.ts
 * @packageDocumentation
 * @module expenseService
 */

import BaseService from '../../http/service/base.service';
import ExpenseRepository from './expense.repository';
import ExpenseInterface from './expense.interface';

/**
 * This is the class service of expense that extend of the base service
 */

class ExpenseService extends BaseService<ExpenseInterface> {
    private static instance: ExpenseService;

    /**
     * Constructor of expense service, instance the expense repository and
     * send it to the baseService
     */

    private constructor() {
      super({
        repository: ExpenseRepository.getInstance(),
      });
    }

    /**
     * Method to instance the expenseService
     * @returns The instance of the expenseService
     */

    public static getInstance(): ExpenseService {
      if (!ExpenseService.instance) {
        ExpenseService.instance = new ExpenseService();
      }

      return ExpenseService.instance;
    }

    /**
     * Method for delete many expenses related with a specify category
     * @param id Id of category for delete expenses related it
     * @returns A promise with the information of delete process
     */

    async deleteManyByCategoryId(id: string) {
      return this.repository.deleteMany({ categoryId: id });
    }

    /**
     * Method to get the information of expenses by category
     * @returns A promise with the information of expenses by category
     */

    async getChartData() {
      return (this.repository as ExpenseRepository).getChartData();
    }
}

export default ExpenseService;
