// file1.ts
/**
 * This is the doc comment for file1.ts
 * @packageDocumentation
 * @module my-module
 */

import { Request } from 'express';
import BaseService from '../service/base.service';

import * as baseFunctions from '../functions/base.functions';
import {RequestExtInterface} from "../interfaces/requestExt.interface";

/**
 * This comment _supports_ [Markdown](https://marked.js.org/)
 */

abstract class BaseController<T> {
    protected service: BaseService<T>;

    protected constructor(service: BaseService<T>) {
      this.service = service;
    }

    async getAllHandler(req: RequestExtInterface) {
      const {
        limit, skip, filters, sortBy,
      } = req.queryParamsParsed;

      const queryFind = baseFunctions.getFiltersForQueryFind(filters);

      const fieldSort = baseFunctions.getFieldSort(sortBy);

      return this.service.getAll({
        queryFind, skip: skip as number, limit: limit as number, fieldSort,
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
