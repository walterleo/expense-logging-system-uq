// base.functions.ts
/**
 * This is the doc comment for base.functions.ts
 * @packageDocumentation
 * @module baseFunctions
 */

const moment = require('moment');

/**
 * Function to get the string of field sort correct to find in the database
 * @param sortBy Array with an object with colId and sort properties
 * @returns The field string for sort
 */

function getFieldSort(sortBy) {
  let fieldSort = '';

  if (sortBy.length > 0) {
    const objectSortBy = sortBy[0];
    fieldSort = `${objectSortBy.sort === 'desc' ? '-' : ''}${objectSortBy.colId}`;
  }

  return fieldSort;
}

/**
 * Function to create the query for find a field
 * @param objectField Object with the instructions for find in a field
 * @returns The query for find the field
 */

function getObjectFind(objectField) {
  let objectFind = {};

  const { filterType } = objectField;

  if (filterType === 'text') {
    const { type, filter } = objectField;
    if (type === 'contains') {
      objectFind = {
        $regex: `${filter}`,
        $options: 'i',
      };
    } else if (type === 'notContains') {
      objectFind = {
        $not: {
          $regex: `${filter}`,
          $options: 'i',
        },
      };
    } else if (type === 'equals') {
      objectFind = filter;
    } else if (type === 'notEqual') {
      objectFind = {
        $ne: filter,
      };
    } else if (type === 'startsWith') {
      objectFind = {
        $regex: `^${filter}`,
        $options: 'i',
      };
    } else if (type === 'endsWith') {
      objectFind = {
        $regex: `${filter}$`,
        $options: 'i',
      };
    }
  } else if (filterType === 'date') {
    const { type, dateFrom } = objectField;

    const dateFromMoment = moment.utc(new Date(dateFrom));
    if (type === 'inRange') {
      const { dateTo } = objectField;

      const dateToMoment = moment.utc(new Date(dateTo)).add(1, 'days');

      objectFind = {
        $gte: dateFromMoment.toDate(),
        $lt: dateToMoment.toDate(),
      };
    } else if (type === 'equals') {
      const dateToMoment = moment.utc(dateFromMoment).add(1, 'days');

      objectFind = {
        $gte: dateFromMoment.toDate(),
        $lt: dateToMoment.toDate(),
      };
    } else if (type === 'notEqual') {
      const dateToMoment = moment.utc(dateFromMoment).add(1, 'days');

      objectFind = {
        $not: {
          $gte: dateFromMoment.toDate(),
          $lt: dateToMoment.toDate(),
        },
      };
    } else if (type === 'greaterThan') {
      objectFind = {
        $gte: dateFromMoment.add(1, 'days').toDate(),
      };
    } else if (type === 'lessThan') {
      objectFind = {
        $lt: dateFromMoment.toDate(),
      };
    }
  } else if (filterType === 'number') {
    const { type, filter } = objectField;

    if (type === 'equals') {
      objectFind = filter;
    } else if (type === 'notEqual') {
      objectFind = {
        $ne: filter,
      };
    } else if (type === 'lessThan') {
      objectFind = {
        $lt: filter,
      };
    } else if (type === 'lessThanOrEqual') {
      objectFind = {
        $lte: filter,
      };
    } else if (type === 'greaterThan') {
      objectFind = {
        $gt: filter,
      };
    } else if (type === 'greaterThanOrEqual') {
      objectFind = {
        $gte: filter,
      };
    } else if (type === 'inRange') {
      const { filterTo } = objectField;
      objectFind = {
        $gte: filter,
        $lte: filterTo,
      };
    }
  } else if (filterType === 'boolean') {
    const { filter } = objectField;
    let value;
    if (filter === 'yes') value = true;
    else if (filter === 'no') value = false;
    else value = { $nin: [true, false] };

    objectFind = value;
  }

  return objectFind;
}

/**
 * Function get the find query complete for find in the database, use the function
 * getObjectFind for find the query for each field
 * @param filters Object with the instructions for find of all fields
 * @returns The query complete for find in the database
 */

function getFiltersForQueryFind(filters) {
  const objectFiltersField: any = {};

  Object.keys(filters).forEach((field) => {
    const objectField = filters[field];

    if (!objectField.operator) {
      const fieldKey = `${field}._id`;

      // eslint-disable-next-line no-underscore-dangle
      if (objectField.filterType === 'categories') {
        objectFiltersField[fieldKey] = getObjectFind(objectField);
      } else {
        objectFiltersField[field] = getObjectFind(objectField);
      }
    } else if (objectField.operator) {
      const objectFilter = {};
      const orArrayConditions = [];
      const andArrayConditions = [];

      objectFilter[field] = getObjectFind(objectField.condition1);

      if (objectField.operator === 'OR') {
        orArrayConditions.push(objectFilter);
      } else if (objectField.operator === 'AND') {
        andArrayConditions.push(objectFilter);
      }

      const objectFilter2 = {};
      objectFilter2[field] = getObjectFind(objectField.condition2);

      if (objectField.operator === 'OR') {
        orArrayConditions.push(objectFilter2);
        objectFiltersField.$or = orArrayConditions;
      } else if (objectField.operator === 'AND') {
        andArrayConditions.push(objectFilter2);
        objectFiltersField.$and = andArrayConditions;
      }
    }
  });

  return objectFiltersField;
}

export { getFiltersForQueryFind, getFieldSort };
