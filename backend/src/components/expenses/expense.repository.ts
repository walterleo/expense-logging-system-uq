import BaseRepository from '../../http/repository/base.repository';
import ExpenseModel from './expense.model';
import ExpenseInterface from './expense.interface';

class ExpenseRepository extends BaseRepository<ExpenseInterface> {
    private static instance: ExpenseRepository;

    private constructor() {
      super({
          model: ExpenseModel,
          getPopulateOpts: [{ path: 'category', select: 'id name' }],
      });
    }

    public static getInstance(): ExpenseRepository {
      if (!ExpenseRepository.instance) {
        ExpenseRepository.instance = new ExpenseRepository();
      }

      return ExpenseRepository.instance;
    }

    async getChartData() {
      return this.model.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $addFields: {
            nameCategory: '$category.name',
          },
        },
        {
          $unwind: '$nameCategory',
        },
        {
          $project: {
            category: 0,
          },
        },
        {
          $group: { _id: '$categoryId', name: { $first: '$nameCategory' }, amount: { $sum: '$amount' } },
        },
        {
          $project: {
            _id: 0,
          },
        }]);
    }
}

export default ExpenseRepository;
