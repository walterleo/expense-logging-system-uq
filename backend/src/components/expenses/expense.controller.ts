// expense.controller.ts
/**
 * This is the doc comment for expense.controller.ts
 * @packageDocumentation
 * @module expenseController
 */

import { BaseController } from '../../http/controller/base.controller';
import ExpenseService from './expense.service';
import ExpenseInterface from './expense.interface';

/**
 * This is the class controller of expense that extend of the base controller
 */

class ExpenseController extends BaseController<ExpenseInterface> {
    private static instance: ExpenseController;

    /**
     * Constructor of expense controller, instance the expense service and 
     * send it to the baseController
     */
    private constructor() {
      super(ExpenseService.getInstance());
    }

    /**
     * Method to instance the expenseController
     * @returns The instance of the expenseController
     */

    public static getInstance(): ExpenseController {
      if (!ExpenseController.instance) {
        ExpenseController.instance = new ExpenseController();
      }

      return ExpenseController.instance;
    }

    /**
     * Method to get the information of expenses by category
     * @returns A promise with the information of expenses by category
     */

    async getChartDataHandler() {
      return (this.service as ExpenseService).getChartData();
    }
}

export default ExpenseController;
