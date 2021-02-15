import {RequestExtInterface} from "../http/interfaces/requestExt.interface";
import { Response, NextFunction } from 'express';

function queryParamsMiddlewareValidation() {
  return async (req: RequestExtInterface, res: Response, next: NextFunction) => {
    const {
      limit, skip, filters, sortBy,
    } = req.query;

    req.queryParamsParsed = {};

    req.queryParamsParsed.limit = Number(limit) || 0;
    req.queryParamsParsed.skip = Number(skip) || 0;

    try {
      req.queryParamsParsed.filters = typeof filters === 'string'
        ? JSON.parse(filters)
        : filters || {};
    } catch (e) {
      req.queryParamsParsed.filters = {};
    }

    try {
      const sortByArray = typeof sortBy === 'string'
        ? JSON.parse(sortBy)
        : sortBy || [];

      for (let i = 0; i < sortByArray.length; i += 1) {
        sortByArray[i] = typeof sortByArray[i] === 'string'
          ? JSON.parse(sortByArray[i])
          : sortByArray[i];
      }

      req.queryParamsParsed.sortBy = sortByArray;
    } catch (e) {
      req.queryParamsParsed.sortBy = [];
    }

    next();
  };
}

export { queryParamsMiddlewareValidation };
