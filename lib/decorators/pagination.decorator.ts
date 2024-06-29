import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { FastifyRequest } from 'fastify';
import { RequestQuery } from '~common';

export interface Pagination {
  page: number;
  limit: number;
  size: number;
  offset: number;
}
interface NumberPropertyConfig {
  min?: number;
  max?: number;
  default?: number;
}
export interface PaginationDecoratorOptions {
  limit: NumberPropertyConfig;
}

export const PaginationParams = createParamDecorator(
  (options: PaginationDecoratorOptions, ctx: ExecutionContext): Pagination => {
    const req: ExpressRequest | FastifyRequest = ctx
      .switchToHttp()
      .getRequest();
    const query = (req.query as RequestQuery) ?? {};
    let page = parseInt(query.page as string, 10);
    if (isNaN(page) || page <= 0) page = 1;
    let limit = parseInt(query.limit as string, 10);
    if (isNaN(limit) && options.limit.default) limit = options.limit.default;
    else {
      if (
        options.limit.min &&
        Number.isInteger(options?.limit?.min) &&
        limit < options.limit.min
      )
        throw new BadRequestException(
          `Page limit should not be less than ${options.limit.min}`
        );
      if (
        options.limit.max &&
        Number.isInteger(options?.limit?.max) &&
        limit > options.limit.max
      )
        throw new BadRequestException(
          `Page limit should not be greater than ${options.limit.min}`
        );
    }

    const offset = (page - 1) * limit;
    return { page, limit, size: limit, offset };
  }
);
