import { describe, it, expect } from 'vitest'
import {
  isFieldEmpty,
  countFieldValue,
  fieldToUrlValue,
  urlValueToField
} from '~/stores/filterFactory/utils'
import type { FilterFieldDefinition } from '~/stores/filterFactory/types'

describe('isFieldEmpty', () => {
  describe('stringArray type', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'stringArray', defaultValue: []
    }

    it('returns true for empty array', () => {
      expect(isFieldEmpty(field, [])).toBe(true)
    })

    it('returns false for non-empty array', () => {
      expect(isFieldEmpty(field, ['a', 'b'])).toBe(false)
    })
  })

  describe('numberArray type', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'numberArray', defaultValue: []
    }

    it('returns true for empty array', () => {
      expect(isFieldEmpty(field, [])).toBe(true)
    })

    it('returns false for non-empty array', () => {
      expect(isFieldEmpty(field, [1, 2])).toBe(false)
    })
  })

  describe('string type', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'string', defaultValue: null
    }

    it('returns true for null', () => {
      expect(isFieldEmpty(field, null)).toBe(true)
    })

    it('returns false for string value', () => {
      expect(isFieldEmpty(field, '1')).toBe(false)
    })
  })

  describe('number type', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'number', defaultValue: null
    }

    it('returns true for null', () => {
      expect(isFieldEmpty(field, null)).toBe(true)
    })

    it('returns false for number value', () => {
      expect(isFieldEmpty(field, 5)).toBe(false)
    })

    it('returns false for zero', () => {
      expect(isFieldEmpty(field, 0)).toBe(false)
    })
  })

  describe('emptyString type', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'emptyString', defaultValue: ''
    }

    it('returns true for empty string', () => {
      expect(isFieldEmpty(field, '')).toBe(true)
    })

    it('returns false for non-empty string', () => {
      expect(isFieldEmpty(field, 'M')).toBe(false)
    })
  })
})

describe('countFieldValue', () => {
  it('counts array length for stringArray', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'stringArray', defaultValue: []
    }
    expect(countFieldValue(field, ['a', 'b', 'c'])).toBe(3)
    expect(countFieldValue(field, [])).toBe(0)
  })

  it('counts array length for numberArray', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'numberArray', defaultValue: []
    }
    expect(countFieldValue(field, [1, 2])).toBe(2)
  })

  it('counts 1 for non-null single values', () => {
    const stringField: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'string', defaultValue: null
    }
    expect(countFieldValue(stringField, '1')).toBe(1)
    expect(countFieldValue(stringField, null)).toBe(0)
  })

  it('counts 1 for non-empty emptyString type', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'emptyString', defaultValue: ''
    }
    expect(countFieldValue(field, 'M')).toBe(1)
    expect(countFieldValue(field, '')).toBe(0)
  })
})

describe('fieldToUrlValue', () => {
  it('returns string array for stringArray type', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'stringArray', defaultValue: []
    }
    expect(fieldToUrlValue(field, ['a', 'b'])).toEqual(['a', 'b'])
  })

  it('converts numberArray to string array', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'numberArray', defaultValue: []
    }
    expect(fieldToUrlValue(field, [6, 8, 10])).toEqual(['6', '8', '10'])
  })

  it('converts number to string for number type', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'number', defaultValue: null
    }
    expect(fieldToUrlValue(field, 5)).toBe('5')
  })

  it('returns string as-is for string type', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'string', defaultValue: null
    }
    expect(fieldToUrlValue(field, '1')).toBe('1')
  })

  it('returns string as-is for emptyString type', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'emptyString', defaultValue: ''
    }
    expect(fieldToUrlValue(field, 'M')).toBe('M')
  })
})

describe('urlValueToField', () => {
  describe('stringArray type', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'stringArray', defaultValue: []
    }

    it('converts single string to array', () => {
      expect(urlValueToField(field, 'a')).toEqual(['a'])
    })

    it('keeps array as string array', () => {
      expect(urlValueToField(field, ['a', 'b'])).toEqual(['a', 'b'])
    })
  })

  describe('numberArray type', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'numberArray', defaultValue: []
    }

    it('converts single string to number array', () => {
      expect(urlValueToField(field, '6')).toEqual([6])
    })

    it('converts string array to number array', () => {
      expect(urlValueToField(field, ['6', '8'])).toEqual([6, 8])
    })
  })

  describe('number type', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'number', defaultValue: null
    }

    it('converts string to number', () => {
      expect(urlValueToField(field, '5')).toBe(5)
    })

    it('takes first element if array', () => {
      expect(urlValueToField(field, ['5', '6'])).toBe(5)
    })
  })

  describe('string type', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'string', defaultValue: null
    }

    it('returns string as-is', () => {
      expect(urlValueToField(field, '1')).toBe('1')
    })

    it('takes first element if array', () => {
      expect(urlValueToField(field, ['1', '0'])).toBe('1')
    })
  })

  describe('emptyString type', () => {
    const field: FilterFieldDefinition = {
      name: 'test', urlKey: 'test', type: 'emptyString', defaultValue: ''
    }

    it('returns string as-is', () => {
      expect(urlValueToField(field, 'M')).toBe('M')
    })
  })
})
