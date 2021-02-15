// base.repository.ts
/**
 * This is the doc comment for base.repository.ts
 * @packageDocumentation
 * @module baseRepository
 */

import {Model, Document, PopulateOptions} from 'mongoose';
import { DeleteOne } from '../interfaces/query.interface';

/**
 * This is the class base for repository that is used by services and is responsible to communicate
 * with the database and return the information to services
 */

abstract class BaseRepository<T> {
    protected model: Model<Document<any>>;
    protected  getPopulateOpts: PopulateOptions[];

    /**
     * Constructor of baseRepository
     * @param model Is the model of component that use the repository
     * @param getPopulateOpts Are the options to make union between collections
     */

    protected constructor({ model, getPopulateOpts }: { model: Model<Document<any>>, getPopulateOpts?: PopulateOptions[] }) {
      this.model = model;
      this.getPopulateOpts = getPopulateOpts || [];
    }

    /**
     * Method for return the number of the documents in query
     * @param queryFind Is the query for find in the database
     * @returns Return a promise with the quantity of documents found
     */

    async count(queryFind: Object) {
      return this.model.find(queryFind).countDocuments();
    }

    /**
     * Method for get the documents in query
     * @param queryFind Is the query for find in the database
     * @param skip Is the number to skip documents in the find
     * @param limit Is the number to limit the response
     * @param fieldSort Is the field by sort de response
     * @returns Return a promise with documents found
     */

    async get({
      queryFind, skip = 0, limit = 0, fieldSort = '',
    }: { queryFind: Object, skip: number, limit: number, fieldSort: String }) {
      return this.model.find(queryFind).sort(fieldSort)
        .skip(skip)
        .limit(limit)
        .populate(this.getPopulateOpts);
    }

    /**
     * Method for create one document in the database
     * @param payload Contains the information of the document
     * @returns Return a promise with the document created
     */

    async createOne(payload: T) {
      return this.model.create(payload);
    }

    /**
     * Method for update one document in the database
     * @param payload Contains the information to update the document
     * @param id Id of the document to update
     * @returns Return a promise with the document updated
     */

    async updateOne({ payload, id }: { payload: T, id: String }) {
      return this.model.findOneAndUpdate({ _id: id }, { $set: payload }, { new: true });
    }

    /**
     * Method for delete one document in the database
     * @param query The query to delete the document
     * @returns Return a promise with the information of delete process
     */

    async deleteOne(query: DeleteOne) {
      return this.model.deleteOne(query);
    }

    /**
     * Method for delete many documents in database
     * @param query The query to delete documents
     * @returns Return a promise with the information of delete process
     */

    async deleteMany(query: object) {
      return this.model.deleteMany(query);
    }
}

export default BaseRepository;
