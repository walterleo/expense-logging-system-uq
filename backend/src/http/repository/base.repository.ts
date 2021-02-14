import {Model, Document, PopulateOptions} from 'mongoose';
import { DeleteOne } from '../interfaces/query.interface';

abstract class BaseRepository<T> {
    protected model: Model<Document<any>>;
    protected  getPopulateOpts: PopulateOptions[];

    protected constructor({ model, getPopulateOpts }: { model: Model<Document<any>>, getPopulateOpts?: PopulateOptions[] }) {
      this.model = model;
      this.getPopulateOpts = getPopulateOpts || [];
    }

    async count(queryFind: Object) {
      return this.model.find(queryFind).countDocuments();
    }

    async get({
      queryFind, skip = 0, limit = 0, fieldSort = '',
    }: { queryFind: Object, skip: number, limit: number, fieldSort: String }) {
      return this.model.find(queryFind).sort(fieldSort)
        .skip(skip)
        .limit(limit)
        .populate(this.getPopulateOpts);
    }

    async createOne(payload: T) {
      return this.model.create(payload);
    }

    async updateOne({ payload, id }: { payload: T, id: String }) {
      return this.model.updateOne({ _id: id }, { $set: payload }, { new: true });
    }

    async deleteOne(query: DeleteOne) {
      return this.model.deleteOne(query);
    }

    async deleteMany(query: object) {
      return this.model.deleteMany(query);
    }
}

export default BaseRepository;
