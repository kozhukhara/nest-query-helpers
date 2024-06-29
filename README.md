# NestJS Query Helpers

## Overview

NPM package providing query utilities for NestJS applications, including easily configurable decorators for pagination, sorting, and filtering. This library simplifies the handling of HTTP request parameters for these functionalities, ensuring robust and maintainable code.

## Features

- **Pagination**: Easily manage page, limit, size, and offset.
- **Sorting**: Support ascending and descending sorting on allowed fields.
- **Filtering**: Apply complex filters with various rules.

## Installation

```bash
npm install library-template
```

## Usage

### Pagination Decorator

#### Example

```typescript
import { PaginationParams, Pagination } from 'nestjs-query-helpers';

@Controller('items')
export class ItemsController {
  @Get()
  findAll(
    @PaginationParams({ limit: { min: 10, max: 250, default: 25 } })
    pagination: Pagination
  ) {
    // Use { page, limit, size, offset } from `pagination`
  }
}
```

### Sorting Decorator

#### Example

```typescript
import { SortingParams, SortDirection, Sorting } from 'nestjs-query-helpers';

@Controller('items')
export class ItemsController {
  @Get()
  findAll(
    @SortingParams({
      allowedFields: ['created_at', 'updated_at', 'other_field'],
      default: { property: 'updated_at', direction: SortDirection.DESC },
    })
    sorting: Sorting
  ) {
    // Use { property, direction } from `sorting`
  }
}
```

### Filtering Decorator

#### Example

```typescript
import { FilteringParams, Filtering, FilterRule } from 'nestjs-query-helpers';

@Controller('items')
export class ItemsController {
  @Get()
  findAll(
    @FilteringParams({
      allowedFields: ['title', 'price'],
      allowedRules: [
        FilterRule.EQUALS,
        FilterRule.GREATER_THAN,
        FilterRule.LESS_THAN,
      ],
    })
    filters: Filtering[]
  ) {
    // Use [{ property, rule, value }, ...] from `filters`
  }
}
```

## TODO

- [ ] Add functions for converting query into ORM parameters
- [ ] Add tests

## License

This project is licensed under the ISC License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## References

- [Bruno Koga @ medium.com](https://blog.stackademic.com/how-to-create-paginated-sortable-and-filterable-endpoints-with-nestjs-fde6315c8466)
