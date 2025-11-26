import type { FilterFieldDefinition } from './types'

/**
 * Check if a field value is "empty" (should not trigger hasActiveFilters).
 */
export function isFieldEmpty(field: FilterFieldDefinition, value: unknown): boolean {
  switch (field.type) {
    case 'stringArray':
    case 'numberArray':
      return !Array.isArray(value) || value.length === 0
    case 'string':
    case 'number':
      return value === null
    case 'emptyString':
      return value === ''
    default:
      return true
  }
}

/**
 * Count the "active" filter count for a field value.
 * Arrays count their length, single values count as 1 if set.
 */
export function countFieldValue(field: FilterFieldDefinition, value: unknown): number {
  switch (field.type) {
    case 'stringArray':
    case 'numberArray':
      return Array.isArray(value) ? value.length : 0
    case 'string':
    case 'number':
      return value !== null ? 1 : 0
    case 'emptyString':
      return value !== '' ? 1 : 0
    default:
      return 0
  }
}

/**
 * Convert a field value to URL query format.
 * Numbers are stringified, arrays are kept as arrays.
 */
export function fieldToUrlValue(
  field: FilterFieldDefinition,
  value: unknown
): string | string[] {
  switch (field.type) {
    case 'stringArray':
      return value as string[]
    case 'numberArray':
      return (value as number[]).map(String)
    case 'number':
      return String(value)
    case 'string':
    case 'emptyString':
      return value as string
    default:
      return String(value)
  }
}

/**
 * Convert a URL query value to the field's expected type.
 * Handles both string and string[] from vue-router LocationQuery.
 */
export function urlValueToField(
  field: FilterFieldDefinition,
  urlValue: string | string[]
): string[] | number[] | string | number {
  const firstValue = Array.isArray(urlValue) ? urlValue[0] : urlValue

  switch (field.type) {
    case 'stringArray':
      return Array.isArray(urlValue) ? urlValue.map(String) : [String(urlValue)]
    case 'numberArray':
      return Array.isArray(urlValue) ? urlValue.map(Number) : [Number(urlValue)]
    case 'number':
      return Number(firstValue)
    case 'string':
    case 'emptyString':
      return String(firstValue)
    default:
      return String(firstValue)
  }
}
