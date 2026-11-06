/** A filter value as the list pages hold it: text, selected options, or a numeric range. */
export type FilterValueLike = string | string[] | { min?: number; max?: number } | undefined;

const isEmpty = (value: FilterValueLike): boolean => {
  if (value === undefined || value === '') {
    return true;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return typeof value === 'object' && value.min === undefined && value.max === undefined;
};

/**
 * Whether two filter values filter the same way. Empty values (no text, no selection,
 * no bounds) are all equal. Used to skip an apply that would change nothing, the way a
 * native `change` event only fires when the value actually changed.
 */
export function filterValuesEqual(a: FilterValueLike, b: FilterValueLike): boolean {
  if (isEmpty(a) || isEmpty(b)) {
    return isEmpty(a) && isEmpty(b);
  }
  if (typeof a === 'string' || typeof b === 'string') {
    return a === b;
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((value, i) => value === b[i]);
  }
  return a!.min === b!.min && a!.max === b!.max;
}
