import { BaseController } from '../../http/controller/base.controller';
import CategoryService from './category.service';
import CategoryInterface from './category.interface';

class CategoryController extends BaseController<CategoryInterface> {
    private static instance: CategoryController;

    private constructor() {
      super(CategoryService.getInstance());
    }

    public static getInstance(): CategoryController {
      if (!CategoryController.instance) {
        CategoryController.instance = new CategoryController();
      }

      return CategoryController.instance;
    }
}

export default CategoryController;
