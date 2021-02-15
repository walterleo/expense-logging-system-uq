// base.controller.ts
/**
 * This is the doc comment for base.controller.ts
 * @packageDocumentation
 * @module baseController
 */

import { Request } from 'express';
import BaseService from '../service/base.service';

import * as baseFunctions from '../functions/base.functions';
import { RequestExtInterface } from '../interfaces/requestExt.interface';

/**
 * This is the class base for controllers components with methods that communicate
 * with routes modules
 */

abstract class BaseController<T> {
    protected service: BaseService<T>;

    /**
     * Constructor of baseController
     * @param service Is the service base with communicate methods in this controller
     */

    protected constructor(service: BaseService<T>) {
      this.service = service;
    }

    /**
     * Method for send to the service all parameters needed from the route req for get
     * many documents
     * @param req The request of the route
     * @returns Return a promise that resolve the list of documents and the quantity
     */

    async getAllHandler(req: RequestExtInterface) {
      const limit = req.queryParamsParsed?.limit;
      const skip = req.queryParamsParsed?.skip;
      const filters = req.queryParamsParsed?.filters;
      const sortBy = req.queryParamsParsed?.sortBy;

      const queryFind = baseFunctions.getFiltersForQueryFind(filters);

      const fieldSort = baseFunctions.getFieldSort(sortBy);

      return this.service.getAll({
        queryFind, skip: skip as number, limit: limit as number, fieldSort,
      });
    }

    /**
     * Method for send to the service all parameters needed from the route to the service
     * for create one document
     * @param req The request of the route
     * @returns Return a promises that resolve the document created
     */

    async createOneHandler(req: Request) {
      const payload = req.body;
      return this.service.createOne(payload);
    }

    /**
     * Method for send to the service all parameters needed from the route to the service
     * for update one document
     * @param req The request of the route
     * @returns Return a promises that resolve the document updated
     */

    async updateOneHandler(req: Request) {
      return this.service.updateOne({
        payload: req.body,
        id: req.params.id,
      });
    }

    /**
     * Method for send to the service all parameters needed from the route to the service
     * for delete one document
     * @param req The request of the route
     * @returns Return a promise with the response of the delete proccess
     */

    async deleteOneHandler(req: Request) {
      return this.service.deleteOne(req.params.id);
    }
}

export { BaseController };
