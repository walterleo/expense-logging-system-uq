import express from 'express';
import boom from '@hapi/boom';
import CategoryController from './category.controller';
import { success } from '../../http/responses';
import { queryParamsMiddlewareValidation } from '../shared.middleware';
import { COMMON_HTTP_ERROR_MSG, COMMON_HTTP_SUCCESS_MSG } from '../shared.constant';

const router: express.Router = express.Router();
const controller = CategoryController.getInstance();

router.get('/',
  queryParamsMiddlewareValidation(),
  (req, res, next) => {
    controller.getAllHandler(req)
      .then((data) => {
        success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.GET_ALL);
      })
      .catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.GET_ALL, err));
      });
  });

router.post('/',
  (req, res, next) => {
    controller.createOneHandler(req)
      .then((data) => {
        success(req, res, data, 201, COMMON_HTTP_SUCCESS_MSG.CREATED);
      })
      .catch((err) => {
        next(boom.internal(COMMON_HTTP_ERROR_MSG.CREATED, err));
      });
  });

router.put('/:id', (req, res, next) => {
  controller.updateOneHandler(req)
    .then((data) => {
      success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.UPDATED);
    })
    .catch((err) => {
      next(boom.internal(COMMON_HTTP_ERROR_MSG.UPDATED, err));
    });
});

router.delete('/:id', (req, res, next) => {
  controller.deleteOneHandler(req)
    .then((data) => {
      success(req, res, data, 200, COMMON_HTTP_SUCCESS_MSG.DELETED);
    }).catch((err) => {
      next(boom.internal(COMMON_HTTP_ERROR_MSG.DELETED, err));
    });
});

export { router };
