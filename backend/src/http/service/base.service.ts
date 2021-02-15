// base.service.ts
/**
 * This is the doc comment for base.service.ts
 * @packageDocumentation
 * @module baseService
 */

import BaseRepository from '../repository/base.repository';

/**
 * This is the class base for service components with methods that communicate
 * with controller modules
 */

abstract class BaseService<T> {
    repository: BaseRepository<T>;

    /**
     * Constructor of baseService
     * @param repository Is the repository base with communicate methods in this service
     */

    protected constructor({ repository }: { repository: BaseRepository<T> }) {
      this.repository = repository;
    }

    /**
     * Method for communicate with repository and get the list of documents and quantity
     * @param queryFind The query object to find in database
     * @param skip The number to skip documents in the response
     * @param limit The number to limit documents in the response
     * @param fieldSort The field by sort the list response
     * @returns An object with data(list of documents) and count properties
     */

    async getAll({
      queryFind, skip, limit, fieldSort,
    }: { queryFind: object, skip: number, limit: number, fieldSort: string }) {
      const count = await this.repository.count(queryFind);
      const data = await this.repository.get({
        queryFind, skip, limit, fieldSort,
      });

      return { data, count };
    }

    /**
     * Method for communicate with repository and get document created
     * @param payload The information of the document
     * @returns A promise with the document created
     */

    async createOne(payload: T) {
      return this.repository.createOne(payload);
    }

    /**
     * Method for communicate with repository and update a document existing
     * @param payload The information of the document new
     * @param id The id of the document to update
     * @returns A promise with the document updated
     */

    async updateOne({ payload, id }: { payload: T, id: String }) {
      return this.repository.updateOne({
        payload,
        id,
      });
    }

    /**
     * Method for communicate with repository and delete a document
     * @param id Id of document to delete
     * @returns A promise with the information of delete process
     */

    async deleteOne(id: string) {
      return this.repository.deleteOne({ _id: id });
    }
}

export default BaseService;
