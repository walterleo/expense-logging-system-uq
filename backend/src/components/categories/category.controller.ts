// category.controller.ts
/**
 * This is the doc comment for category.controller.ts
 * @packageDocumentation
 * @module categoryController
 */

import { BaseController } from '../../http/controller/base.controller';
import CategoryService from './category.service';
import CategoryInterface from './category.interface';

/**
 * This is the class controller of category that extend of the base controller
 */

class CategoryController extends BaseController<CategoryInterface> {
    private static instance: CategoryController;

    /**
     * Constructor of category controller, instance the category service and 
     * send it to the baseController
     */

    private constructor() {
      super(CategoryService.getInstance());
    }

    /**
     * Method to instance the categoryController
     * @returns The instance of the categoryController
     */

    public static getInstance(): CategoryController {
      if (!CategoryController.instance) {
        CategoryController.instance = new CategoryController();
      }

      return CategoryController.instance;
    }
}

export default CategoryController;
