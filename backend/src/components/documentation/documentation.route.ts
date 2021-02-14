import express from 'express';
import swaggerUi = require('swagger-ui-express');
import swaggerDocument from './swagger.json';
const router: express.Router = express.Router();

router.use('/api-docs', swaggerUi.serve);

router.get('/api-docs', swaggerUi.setup(swaggerDocument));

export { router };