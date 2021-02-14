import BaseService from '@/services/base.service';
import CategoryInterface from '@/interfaces/category.interface';

class CategoryService extends BaseService<CategoryInterface> {
  private static instance: CategoryService;

  private constructor() {
    super('categories');
  }

  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }

    return CategoryService.instance;
  }
}

export default CategoryService;
