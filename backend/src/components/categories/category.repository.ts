// category.repository.ts
/**
 * This is the doc comment for category.repository.ts
 * @packageDocumentation
 * @module CategoryRepository
 */

import BaseRepository from '../../http/repository/base.repository';
import CategoryModel from './category.model';
import CategoryInterface from './category.interface';

/**
 * This is the class repository of category that extend of the baseRepository
 */

class CategoryRepository extends BaseRepository<CategoryInterface> {
    private static instance: CategoryRepository;

    /**
     * Constructor of category repository, send the model of category to baseRepository
     */

    private constructor() {
      super({ model: CategoryModel });
    }

    /**
     * Method to instance the categoryRepository
     * @returns The instance of the CategoryRepository
     */

    public static getInstance(): CategoryRepository {
      if (!CategoryRepository.instance) {
        CategoryRepository.instance = new CategoryRepository();
      }

      return CategoryRepository.instance;
    }
}

export default CategoryRepository;
