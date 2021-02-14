import { BaseController } from '../../http/controller/base.controller';
import ExpenseService from './expense.service';
import ExpenseInterface from './expense.interface';

class ExpenseController extends BaseController<ExpenseInterface> {
    private static instance: ExpenseController;

    private constructor() {
      super(ExpenseService.getInstance());
    }

    public static getInstance(): ExpenseController {
      if (!ExpenseController.instance) {
        ExpenseController.instance = new ExpenseController();
      }

      return ExpenseController.instance;
    }

    async getChartDataHandler() {
      return (this.service as ExpenseService).getChartData();
    }
}

export default ExpenseController;
