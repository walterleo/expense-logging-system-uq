import BaseRepository from '../../http/repository/base.repository';
import CategoryModel from './category.model';
import CategoryInterface from './category.interface';

class CategoryRepository extends BaseRepository<CategoryInterface> {
    private static instance: CategoryRepository;

    private constructor() {
      super({ model: CategoryModel });
    }

    public static getInstance(): CategoryRepository {
      if (!CategoryRepository.instance) {
        CategoryRepository.instance = new CategoryRepository();
      }

      return CategoryRepository.instance;
    }
}

export default CategoryRepository;
