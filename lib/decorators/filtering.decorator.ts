import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { FastifyRequest } from 'fastify';
import { RequestQuery } from '~common';

export interface Filtering {
  [property: string]: Record<string, any>;
}

export enum FilterRule {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  LIKE = 'like',
  NOT_LIKE = 'nlike',
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'isnull',
  IS_NOT_NULL = 'isnotnull',
  IS_TRUE = 'istrue',
  IS_FALSE = 'isfalse',
}

export interface FilteringDecoratorOptions {
  allowedFields?: string[];
  allowedRules?: FilterRule[];
}

export const FilteringParams = createParamDecorator(
  (options: FilteringDecoratorOptions, ctx: ExecutionContext): Filtering => {
    const req: ExpressRequest | FastifyRequest = ctx
      .switchToHttp()
      .getRequest();
    const filters = (req.query as RequestQuery).filters;

    const parseFilter = (filter: string): Filtering | null => {
      if (!filter) return null;

      if (
        !filter.match(
          /^[a-zA-Z0-9_]+:(eq|neq|gt|gte|lt|lte|like|nlike|in|nin):[a-zA-Z0-9\-,|]+$/
        ) &&
        !filter.match(/^[a-zA-Z0-9_]+:(isnull|isnotnull|istrue|isfalse)$/)
      ) {
        throw new BadRequestException('Invalid filter parameter');
      }

      const [property, rule, value] = filter.split(':');
      if (
        options.allowedFields?.length &&
        !options.allowedFields.includes(property)
      )
        throw new BadRequestException(`Invalid filter property: ${property}`);
      if (!Object.values(FilterRule).includes(rule as FilterRule)) {
        throw new BadRequestException(`Invalid filter rule: ${rule}`);
      }
      if (
        options.allowedRules?.length &&
        !options.allowedRules.includes(rule as FilterRule)
      )
        throw new BadRequestException(`Filter rule \`${rule}\` not allowed`);

      return { [property]: { [rule as FilterRule]: value } };
    };

    const parsedFilters = (Array.isArray(filters) ? filters : [filters])
      .map(parseFilter)
      .filter((f): f is Filtering => !!f);

    return parsedFilters.reduce((acc, curr) => {
      const key = Object.keys(curr)[0];
      acc[key] = curr[key];
      return acc;
    }, {} as Filtering);
  }
);
