import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { FastifyRequest } from 'fastify';
import { RequestQuery } from '~common';

export interface Sorting {
  property?: string;
  direction?: SortDirection;
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface SortingDecoratorOptions {
  allowedFields: string[];
  default?: Sorting;
}

export const SortingParams = createParamDecorator(
  (
    validParams: SortingDecoratorOptions,
    ctx: ExecutionContext
  ): Sorting | null => {
    const req: ExpressRequest | FastifyRequest = ctx
      .switchToHttp()
      .getRequest();
    const sort = (req.query as RequestQuery).sort as string;
    if (!sort)
      return validParams.default?.property && validParams.default?.direction
        ? validParams.default
        : null;

    if (typeof validParams != 'object')
      throw new BadRequestException('Invalid sort parameter');

    const sortPattern = new RegExp(
      `^([a-zA-Z0-9]+):(${SortDirection.ASC}|${SortDirection.DESC})$`
    );
    if (!sort.match(sortPattern))
      throw new BadRequestException('Invalid sort parameter');

    const [property, direction] = sort.split(':');
    if (
      validParams.allowedFields?.length &&
      !validParams.allowedFields.includes(property)
    )
      throw new BadRequestException(`Invalid sort property: ${property}`);

    return { property, direction: direction as SortDirection };
  }
);
