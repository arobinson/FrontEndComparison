import { allColumns, type ColumnDataType } from '../types/column-config.types.js';
import type { FilterValueLike } from './filter-values.js';

/**
 * The product list's state that belongs in the URL: which page, how many rows,
 * and the applied (committed) filters. Restored on reload, on Back from a product,
 * and when a link is shared.
 *
 *   /list?page=3&pageSize=25&grade=A,B&qualityScore=20..80&brand=acme
 */
export interface ListQuery {
  /** 0-based page index (the URL is 1-based) */
  page: number;
  pageSize: number;
  filters: Record<string, FilterValueLike>;
}

export const DEFAULT_PAGE_SIZE = 50;

export type FilterKind = 'text' | 'range' | 'multi' | 'none';

/** Which filter control a column type uses (the list templates switch on the same types). */
export function filterKind(type: ColumnDataType): FilterKind {
  switch (type) {
    case 'progress-bar':
    case 'large-counter':
      return 'range';
    case 'grade-badge':
    case 'nova-dots':
    case 'boolean-yesno':
      return 'multi';
    case 'product-image':
      return 'none';
    default:
      return 'text';
  }
}

const columnKinds = new Map(allColumns.map((column) => [column.key as string, filterKind(column.type)]));

const parseBound = (text: string): number | undefined => {
  if (text === '') {
    return undefined;
  }
  const value = Number(text);
  return Number.isFinite(value) ? value : undefined;
};

const parsePositiveInt = (text: string | null): number | undefined => {
  const value = Number(text);
  return Number.isInteger(value) && value > 0 ? value : undefined;
};

/** Reads the list state from a URL query string (`?page=2&…`). Unknown or malformed values are ignored. */
export function parseListQuery(search: string | URLSearchParams): ListQuery {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search;
  const filters: Record<string, FilterValueLike> = {};
  // 'page' and 'pageSize' are not column keys, so they never read as filters
  for (const [key, text] of params) {
    const kind = columnKinds.get(key);
    if (kind === 'text') {
      filters[key] = text;
    } else if (kind === 'multi') {
      filters[key] = text.split(',').filter(Boolean);
    } else if (kind === 'range') {
      const [min = '', max = ''] = text.split('..');
      filters[key] = { min: parseBound(min), max: parseBound(max) };
    }
  }
  return {
    page: (parsePositiveInt(params.get('page')) ?? 1) - 1,
    pageSize: parsePositiveInt(params.get('pageSize')) ?? DEFAULT_PAGE_SIZE,
    filters,
  };
}

const encodeFilter = (value: FilterValueLike): string => {
  if (value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.join(',');
  }
  if (value.min === undefined && value.max === undefined) {
    return '';
  }
  return `${value.min ?? ''}..${value.max ?? ''}`;
};

/**
 * Writes the list state as a query string: `''` for the defaults, otherwise `?…`.
 * Defaults and empty filters are left out, and filters follow column order, so one
 * state always has one URL.
 */
export function listQuerySearch({ page, pageSize, filters }: ListQuery): string {
  const params = new URLSearchParams();
  if (page > 0) {
    params.set('page', String(page + 1));
  }
  if (pageSize !== DEFAULT_PAGE_SIZE) {
    params.set('pageSize', String(pageSize));
  }
  for (const column of allColumns) {
    const text = encodeFilter(filters[column.key]);
    if (text) {
      params.set(column.key, text);
    }
  }
  const search = params.toString();
  return search ? `?${search}` : '';
}
