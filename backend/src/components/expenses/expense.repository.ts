// expense.repository.ts
/**
 * This is the doc comment for expense.repository.ts
 * @packageDocumentation
 * @module ExpenseRepository
 */

import BaseRepository from '../../http/repository/base.repository';
import ExpenseModel from './expense.model';
import ExpenseInterface from './expense.interface';

/**
 * This is the class repository of expense that extend of the baseRepository
 */

class ExpenseRepository extends BaseRepository<ExpenseInterface> {
    private static instance: ExpenseRepository;

    /**
     * Constructor of expense repository, send the model of expense to baseRepository
     * and populate options
     */

    private constructor() {
      super({
        model: ExpenseModel,
        getPopulateOpts: [{ path: 'category', select: 'id name' }],
      });
    }

    /**
     * Method to instance the expenseRepository
     * @returns The instance of the expenseRepository
     */

    public static getInstance(): ExpenseRepository {
      if (!ExpenseRepository.instance) {
        ExpenseRepository.instance = new ExpenseRepository();
      }

      return ExpenseRepository.instance;
    }

    /**
     * Method with aggregation to get information of expenses by category
     * @returns A promise with the information of expenses by category
     */

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
