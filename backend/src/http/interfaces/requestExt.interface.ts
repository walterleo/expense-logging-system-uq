import { Request } from 'express';
import { QueryParamsParsedInterface } from './queryParamsParsed.interface';

export interface RequestExtInterface extends Request {
    queryParamsParsed?: QueryParamsParsedInterface;
};
