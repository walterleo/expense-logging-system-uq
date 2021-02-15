import appService from '@/services/index';
import FetchParamsInterface from '@/interfaces/fetchParams.interface';

export default abstract class BaseService<T> {
  baseUrl: string;

  protected constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getAll(params: FetchParamsInterface) {
    const resp = await appService.get(this.baseUrl, { params });
    return resp.data;
  }

  async getOne(id: string) {
    const resp = await appService.get(`${this.baseUrl}/${id}`);
    return resp.data;
  }

  async create(payload: T) {
    const resp = await appService.post(this.baseUrl, payload);
    return resp.data;
  }

  async edit(id: string, payload: T): Promise<T> {
    const resp = await appService.put(`${this.baseUrl}/${id}`, payload);
    return resp.data;
  }

  async delete(id: string) {
    const resp = await appService.delete(`${this.baseUrl}/${id}`);
    return resp.data;
  }
}
