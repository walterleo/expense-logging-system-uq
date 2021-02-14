import BaseService from '@/services/base.service';
import ExpenseInterface from '@/interfaces/expense.interface.';
import appService from '@/services/index';

class ExpenseService extends BaseService<ExpenseInterface> {
  private static instance: ExpenseService;

  private constructor() {
    super('expenses');
  }

  public static getInstance(): ExpenseService {
    if (!ExpenseService.instance) {
      ExpenseService.instance = new ExpenseService();
    }

    return ExpenseService.instance;
  }

  async getExpensesByCategories() {
    const resp = await appService.get(`${this.baseUrl}/by-categories`);
    return resp.data;
  }
}

export default ExpenseService;
