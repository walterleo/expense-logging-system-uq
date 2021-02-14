import { router as category } from '../components/categories/category.route';
import { router as expense } from '../components/expenses/expense.route';
import { router as documentation } from '../components/documentation/documentation.route';

const routes = (server) => {
  server.use('/categories', category);
  server.use('/expenses', expense);
  server.use('/documentation', documentation);
};

export { routes };
