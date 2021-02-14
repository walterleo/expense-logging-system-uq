import BaseService from '../../http/service/base.service';
import ExpenseRepository from './expense.repository';
import ExpenseInterface from './expense.interface';

class ExpenseService extends BaseService<ExpenseInterface> {
    private static instance: ExpenseService;

    private constructor() {
      super({
        repository: ExpenseRepository.getInstance(),
      });
    }

    public static getInstance(): ExpenseService {
      if (!ExpenseService.instance) {
        ExpenseService.instance = new ExpenseService();
      }

      return ExpenseService.instance;
    }

    async deleteManyByCategoryId(id: string) {
        console.log('deleteManyByCategoryId expensive');
        return this.repository.deleteMany({ categoryId: id });
    }

    async getChartData() {
      return (this.repository as ExpenseRepository).getChartData();
    }
}

export default ExpenseService;
