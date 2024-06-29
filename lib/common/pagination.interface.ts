export type PaginatedResource<T> = {
  results: T[];
  meta: {
    total: number;
    page: number;
    size: number;
  };
};
