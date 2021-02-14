import BaseRepository from '../repository/base.repository';

abstract class BaseService<T> {
    repository: BaseRepository<T>;

    protected constructor({ repository }: { repository: BaseRepository<T> }) {
      this.repository = repository;
    }

    async getAll({
      queryFind, skip, limit, fieldSort,
    }: { queryFind: object, skip: number, limit: number, fieldSort: string }) {
      const count = await this.repository.count(queryFind);
      const data = await this.repository.get({
        queryFind, skip, limit, fieldSort,
      });

      return { data, count };
    }

    async createOne(payload: T) {
      return this.repository.createOne(payload);
    }

    async updateOne({ payload, id }: { payload: T, id: String }) {
      return this.repository.updateOne({
        payload,
        id,
      });
    }

    async deleteOne(id: string) {
        console.log('deleteOne base');
        return this.repository.deleteOne({ _id: id });
    }
}

export default BaseService;
