import { Request } from 'express';
import BaseService from '../service/base.service';

import * as baseFunctions from '../functions/base.functions';

abstract class BaseController<T> {
    protected service: BaseService<T>;

    protected constructor(service: BaseService<T>) {
      this.service = service;
    }

    async getAllHandler(req: Request) {
      const {
        limit, skip, filters, sortBy,
      } = req.query;

      const queryFind = baseFunctions.getFiltersForQueryFind(filters);

      const fieldSort = baseFunctions.getFieldSort(sortBy);

      return this.service.getAll({
        queryFind, skip, limit, fieldSort,
      });
    }

    async createOneHandler(req: Request) {
      const payload = req.body;
      return this.service.createOne(payload);
    }

    async updateOneHandler(req: Request) {
      return this.service.updateOne({
        payload: req.body,
        id: req.params.id,
      });
    }

    async deleteOneHandler(req: Request) {
        console.log('deleteOneHandler base');
      return this.service.deleteOne(req.params.id);
    }
}

export { BaseController };
