// tests/components/character/sheet/AddConditionModal.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AddConditionModal from '~/components/character/sheet/AddConditionModal.vue'
import type { Condition } from '~/types'

/**
 * Type for accessing AddConditionModal internal state in tests
 */
interface AddConditionModalVM {
  selectedCondition: Condition | null
  source: string
  duration: string
  level: number
  isExhaustion: boolean
  canAdd: boolean
  handleAdd: () => void
  handleCancel: () => void
  selectCondition: (condition: Condition) => void
}

/**
 * Mock conditions for testing
 */
const mockConditions: Condition[] = [
  { id: 1, name: 'Blinded', slug: 'core:blinded', description: 'Cannot see', monster_count: 0, spell_count: 0 },
  { id: 2, name: 'Charmed', slug: 'core:charmed', description: 'Cannot attack charmer', monster_count: 0, spell_count: 0 },
  { id: 3, name: 'Poisoned', slug: 'core:poisoned', description: 'Disadvantage on attacks', monster_count: 0, spell_count: 0 },
  { id: 15, name: 'Exhaustion', slug: 'core:exhaustion', description: 'Levels 1-6', monster_count: 0, spell_count: 0 }
]

/**
 * Note: UModal uses teleportation which makes DOM testing complex.
 * These tests focus on component interface (props/events) rather than rendered output.
 * Actual modal interaction is tested via E2E tests.
 */
describe('AddConditionModal', () => {
  const defaultProps = {
    open: true,
    availableConditions: mockConditions
  }

  // =========================================================================
  // Props Interface Tests
  // =========================================================================

  describe('props', () => {
    it('accepts open prop', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      expect(wrapper.props('open')).toBe(true)
    })

    it('accepts availableConditions prop', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      expect(wrapper.props('availableConditions')).toEqual(mockConditions)
    })

    it('mounts when closed', () => {
      const wrapper = mount(AddConditionModal, {
        props: { ...defaultProps, open: false }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.props('open')).toBe(false)
    })
  })

  // =========================================================================
  // Component Interface Tests
  // =========================================================================

  describe('component interface', () => {
    it('mounts without error', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('initializes with no condition selected', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      expect(vm.selectedCondition).toBe(null)
    })

    it('initializes with empty source', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      expect(vm.source).toBe('')
    })

    it('initializes with empty duration', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      expect(vm.duration).toBe('')
    })

    it('initializes with level 1 (for exhaustion)', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      expect(vm.level).toBe(1)
    })
  })

  // =========================================================================
  // Condition Selection Tests
  // =========================================================================

  describe('condition selection', () => {
    it('selectCondition updates selectedCondition', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      const poisoned = mockConditions[2]

      vm.selectCondition(poisoned)

      expect(vm.selectedCondition).toEqual(poisoned)
    })

    it('can change selected condition', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      const poisoned = mockConditions[2]
      const blinded = mockConditions[0]

      vm.selectCondition(poisoned)
      vm.selectCondition(blinded)

      expect(vm.selectedCondition).toEqual(blinded)
    })
  })

  // =========================================================================
  // Exhaustion Detection Tests
  // =========================================================================

  describe('isExhaustion computed', () => {
    it('returns false when no condition selected', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM

      expect(vm.isExhaustion).toBe(false)
    })

    it('returns false when non-exhaustion condition selected', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      vm.selectCondition(mockConditions[2]) // Poisoned

      expect(vm.isExhaustion).toBe(false)
    })

    it('returns true when exhaustion condition selected', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      vm.selectCondition(mockConditions[3]) // Exhaustion

      expect(vm.isExhaustion).toBe(true)
    })
  })

  // =========================================================================
  // canAdd Computed Tests
  // =========================================================================

  describe('canAdd computed', () => {
    it('returns false when no condition selected', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM

      expect(vm.canAdd).toBe(false)
    })

    it('returns true when condition selected', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      vm.selectCondition(mockConditions[0])

      expect(vm.canAdd).toBe(true)
    })

    it('returns true when exhaustion selected (level defaults to 1)', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      vm.selectCondition(mockConditions[3]) // Exhaustion

      expect(vm.canAdd).toBe(true)
    })
  })

  // =========================================================================
  // Event Handler Tests
  // =========================================================================

  describe('events interface', () => {
    it('emits add with condition slug when handleAdd called', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      vm.selectCondition(mockConditions[2]) // Poisoned
      vm.handleAdd()

      expect(wrapper.emitted('add')).toBeTruthy()
      expect(wrapper.emitted('add')![0]).toEqual([{
        condition: 'core:poisoned',
        source: '',
        duration: '',
        level: undefined
      }])
    })

    it('emits add with source when provided', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      vm.selectCondition(mockConditions[2]) // Poisoned
      vm.source = 'Giant Spider bite'
      vm.handleAdd()

      expect(wrapper.emitted('add')![0]).toEqual([{
        condition: 'core:poisoned',
        source: 'Giant Spider bite',
        duration: '',
        level: undefined
      }])
    })

    it('emits add with duration when provided', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      vm.selectCondition(mockConditions[2]) // Poisoned
      vm.duration = '1 hour'
      vm.handleAdd()

      expect(wrapper.emitted('add')![0]).toEqual([{
        condition: 'core:poisoned',
        source: '',
        duration: '1 hour',
        level: undefined
      }])
    })

    it('emits add with level for exhaustion', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      vm.selectCondition(mockConditions[3]) // Exhaustion
      vm.level = 3
      vm.handleAdd()

      expect(wrapper.emitted('add')![0]).toEqual([{
        condition: 'core:exhaustion',
        source: '',
        duration: '',
        level: 3
      }])
    })

    it('emits add with all fields populated', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      vm.selectCondition(mockConditions[3]) // Exhaustion
      vm.source = 'Forced march'
      vm.duration = 'Until long rest'
      vm.level = 2
      vm.handleAdd()

      expect(wrapper.emitted('add')![0]).toEqual([{
        condition: 'core:exhaustion',
        source: 'Forced march',
        duration: 'Until long rest',
        level: 2
      }])
    })

    it('emits update:open false when handleAdd called', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      vm.selectCondition(mockConditions[0])
      vm.handleAdd()

      expect(wrapper.emitted('update:open')).toBeTruthy()
      expect(wrapper.emitted('update:open')![0]).toEqual([false])
    })

    it('does not emit add when handleAdd called without selection', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      vm.handleAdd()

      expect(wrapper.emitted('add')).toBeUndefined()
    })

    it('emits update:open false when handleCancel called', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      vm.handleCancel()

      expect(wrapper.emitted('update:open')).toBeTruthy()
      expect(wrapper.emitted('update:open')![0]).toEqual([false])
    })

    it('does not emit add when handleCancel called', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM
      vm.selectCondition(mockConditions[0])
      vm.handleCancel()

      expect(wrapper.emitted('add')).toBeUndefined()
    })
  })

  // =========================================================================
  // State Reset Tests
  // =========================================================================

  describe('state reset on close', () => {
    it('resets selectedCondition when modal opens', async () => {
      const wrapper = mount(AddConditionModal, {
        props: { ...defaultProps, open: false }
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM

      // Select a condition
      vm.selectCondition(mockConditions[0])
      expect(vm.selectedCondition).not.toBe(null)

      // Open the modal (simulates prop change)
      await wrapper.setProps({ open: true })

      // Selection should be reset
      expect(vm.selectedCondition).toBe(null)
    })

    it('resets source when modal opens', async () => {
      const wrapper = mount(AddConditionModal, {
        props: { ...defaultProps, open: false }
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM

      vm.source = 'Some source'
      await wrapper.setProps({ open: true })

      expect(vm.source).toBe('')
    })

    it('resets duration when modal opens', async () => {
      const wrapper = mount(AddConditionModal, {
        props: { ...defaultProps, open: false }
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM

      vm.duration = '1 hour'
      await wrapper.setProps({ open: true })

      expect(vm.duration).toBe('')
    })

    it('resets level to 1 when modal opens', async () => {
      const wrapper = mount(AddConditionModal, {
        props: { ...defaultProps, open: false }
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM

      vm.level = 5
      await wrapper.setProps({ open: true })

      expect(vm.level).toBe(1)
    })
  })

  // =========================================================================
  // Level Validation Tests
  // =========================================================================

  describe('exhaustion level', () => {
    it('level defaults to 1', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM

      expect(vm.level).toBe(1)
    })

    it('level can be set to valid values (1-6)', () => {
      const wrapper = mount(AddConditionModal, {
        props: defaultProps
      })
      const vm = wrapper.vm as unknown as AddConditionModalVM

      vm.level = 3
      expect(vm.level).toBe(3)

      vm.level = 6
      expect(vm.level).toBe(6)
    })
  })
})
