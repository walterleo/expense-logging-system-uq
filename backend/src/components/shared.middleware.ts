function queryParamsMiddlewareValidation() {
  return async (req, res, next) => {
    const {
      limit, skip, filters, sortBy,
    } = req.query;

    req.query.limit = Number(limit) || 0;
    req.query.skip = Number(skip) || 0;

    try {
      req.query.filters = typeof filters === 'string'
        ? JSON.parse(filters)
        : filters || {};
    } catch (e) {
      req.query.filters = {};
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

      req.query.sortBy = sortByArray;
    } catch (e) {
      req.query.sortBy = [];
    }

    next();
  };
}

export { queryParamsMiddlewareValidation };