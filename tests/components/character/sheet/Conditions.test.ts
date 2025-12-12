// tests/components/character/sheet/Conditions.test.ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Conditions from '~/components/character/sheet/Conditions.vue'

describe('CharacterSheetConditions', () => {
  it('renders nothing when conditions is undefined', async () => {
    const wrapper = await mountSuspended(Conditions, {
      props: { conditions: undefined }
    })
    expect(wrapper.find('[data-testid="conditions-alert"]').exists()).toBe(false)
  })

  it('renders nothing when conditions array is empty', async () => {
    const wrapper = await mountSuspended(Conditions, {
      props: { conditions: [] }
    })
    expect(wrapper.find('[data-testid="conditions-alert"]').exists()).toBe(false)
  })

  it('renders alert when conditions are present', async () => {
    const wrapper = await mountSuspended(Conditions, {
      props: {
        conditions: [
          {
            id: '1',
            name: 'Poisoned',
            slug: 'poisoned',
            level: '',
            source: 'Giant Spider bite',
            duration: '2 hours',
            is_dangling: false
          }
        ]
      }
    })
    expect(wrapper.find('[data-testid="conditions-alert"]').exists()).toBe(true)
  })

  it('displays condition name', async () => {
    const wrapper = await mountSuspended(Conditions, {
      props: {
        conditions: [
          {
            id: '1',
            name: 'Poisoned',
            slug: 'poisoned',
            level: '',
            source: 'Giant Spider bite',
            duration: '2 hours',
            is_dangling: false
          }
        ]
      }
    })
    expect(wrapper.text()).toContain('Poisoned')
  })

  it('displays condition duration', async () => {
    const wrapper = await mountSuspended(Conditions, {
      props: {
        conditions: [
          {
            id: '1',
            name: 'Poisoned',
            slug: 'poisoned',
            level: '',
            source: 'Giant Spider bite',
            duration: '2 hours',
            is_dangling: false
          }
        ]
      }
    })
    expect(wrapper.text()).toContain('2 hours')
  })

  it('displays multiple conditions', async () => {
    const wrapper = await mountSuspended(Conditions, {
      props: {
        conditions: [
          {
            id: '1',
            name: 'Poisoned',
            slug: 'poisoned',
            level: '',
            source: 'Giant Spider bite',
            duration: '2 hours',
            is_dangling: false
          },
          {
            id: '2',
            name: 'Frightened',
            slug: 'frightened',
            level: '',
            source: 'Dragon Fear',
            duration: 'Until end of next turn',
            is_dangling: false
          }
        ]
      }
    })
    expect(wrapper.text()).toContain('Poisoned')
    expect(wrapper.text()).toContain('Frightened')
  })

  it('displays exhaustion level when present', async () => {
    const wrapper = await mountSuspended(Conditions, {
      props: {
        conditions: [
          {
            id: '1',
            name: 'Exhaustion',
            slug: 'exhaustion',
            level: '2',
            source: 'Extended travel',
            duration: 'Until long rest',
            is_dangling: false
          }
        ]
      }
    })
    expect(wrapper.text()).toContain('Exhaustion')
    expect(wrapper.text()).toContain('2')
  })

  it('handles dangling condition gracefully', async () => {
    const wrapper = await mountSuspended(Conditions, {
      props: {
        conditions: [
          {
            id: '1',
            name: 'Unknown Condition',
            slug: 'unknown',
            level: '',
            source: 'Homebrew spell',
            duration: '1 minute',
            is_dangling: true
          }
        ]
      }
    })
    // Should still render, even if dangling
    expect(wrapper.find('[data-testid="conditions-alert"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Unknown Condition')
  })

  it('displays count of active conditions in title', async () => {
    const wrapper = await mountSuspended(Conditions, {
      props: {
        conditions: [
          {
            id: '1',
            name: 'Poisoned',
            slug: 'poisoned',
            level: '',
            source: 'Giant Spider bite',
            duration: '2 hours',
            is_dangling: false
          },
          {
            id: '2',
            name: 'Frightened',
            slug: 'frightened',
            level: '',
            source: 'Dragon Fear',
            duration: 'Until end of next turn',
            is_dangling: false
          }
        ]
      }
    })
    // Title should mention number of conditions
    expect(wrapper.text()).toMatch(/2.*condition/i)
  })

  it('displays single condition with correct singular form', async () => {
    const wrapper = await mountSuspended(Conditions, {
      props: {
        conditions: [
          {
            id: '1',
            name: 'Poisoned',
            slug: 'poisoned',
            level: '',
            source: 'Giant Spider bite',
            duration: '2 hours',
            is_dangling: false
          }
        ]
      }
    })
    // Should say "1 Active Condition" not "1 Active Conditions"
    const text = wrapper.text()
    expect(text).toMatch(/1.*Active Condition[^s]/i)
  })

  // =========================================================================
  // Editable Mode Tests
  // =========================================================================

  describe('editable mode', () => {
    const mockCondition = {
      id: '1',
      name: 'Poisoned',
      slug: 'core:poisoned',
      level: '',
      source: 'Giant Spider bite',
      duration: '2 hours',
      is_dangling: false
    }

    const mockExhaustion = {
      id: '2',
      name: 'Exhaustion',
      slug: 'core:exhaustion',
      level: '2',
      source: 'Forced march',
      duration: 'Until long rest',
      is_dangling: false
    }

    it('shows add condition button when editable and no conditions', async () => {
      const wrapper = await mountSuspended(Conditions, {
        props: { conditions: [], editable: true }
      })
      expect(wrapper.find('[data-testid="add-condition-btn"]').exists()).toBe(true)
    })

    it('hides add condition button when not editable', async () => {
      const wrapper = await mountSuspended(Conditions, {
        props: { conditions: [], editable: false }
      })
      expect(wrapper.find('[data-testid="add-condition-btn"]').exists()).toBe(false)
    })

    it('shows add condition button when editable and has conditions', async () => {
      const wrapper = await mountSuspended(Conditions, {
        props: { conditions: [mockCondition], editable: true }
      })
      expect(wrapper.find('[data-testid="add-condition-btn"]').exists()).toBe(true)
    })

    it('shows remove button on each condition when editable', async () => {
      const wrapper = await mountSuspended(Conditions, {
        props: { conditions: [mockCondition], editable: true }
      })
      expect(wrapper.find('[data-testid="remove-condition-core:poisoned"]').exists()).toBe(true)
    })

    it('hides remove button when not editable', async () => {
      const wrapper = await mountSuspended(Conditions, {
        props: { conditions: [mockCondition], editable: false }
      })
      expect(wrapper.find('[data-testid="remove-condition-core:poisoned"]').exists()).toBe(false)
    })

    it('emits remove with slug when remove button clicked', async () => {
      const wrapper = await mountSuspended(Conditions, {
        props: { conditions: [mockCondition], editable: true }
      })
      await wrapper.find('[data-testid="remove-condition-core:poisoned"]').trigger('click')
      expect(wrapper.emitted('remove')).toBeTruthy()
      expect(wrapper.emitted('remove')![0]).toEqual(['core:poisoned'])
    })

    it('shows exhaustion stepper buttons when editable', async () => {
      const wrapper = await mountSuspended(Conditions, {
        props: { conditions: [mockExhaustion], editable: true }
      })
      expect(wrapper.find('[data-testid="exhaustion-increment"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="exhaustion-decrement"]').exists()).toBe(true)
    })

    it('hides exhaustion stepper when not editable', async () => {
      const wrapper = await mountSuspended(Conditions, {
        props: { conditions: [mockExhaustion], editable: false }
      })
      expect(wrapper.find('[data-testid="exhaustion-increment"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="exhaustion-decrement"]').exists()).toBe(false)
    })

    it('does not show stepper for non-exhaustion conditions', async () => {
      const wrapper = await mountSuspended(Conditions, {
        props: { conditions: [mockCondition], editable: true }
      })
      expect(wrapper.find('[data-testid="exhaustion-increment"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="exhaustion-decrement"]').exists()).toBe(false)
    })

    it('emits update-level with incremented value when + clicked', async () => {
      const wrapper = await mountSuspended(Conditions, {
        props: { conditions: [mockExhaustion], editable: true }
      })
      await wrapper.find('[data-testid="exhaustion-increment"]').trigger('click')
      expect(wrapper.emitted('update-level')).toBeTruthy()
      expect(wrapper.emitted('update-level')![0]).toEqual([{ slug: 'core:exhaustion', level: 3 }])
    })

    it('emits update-level with decremented value when - clicked', async () => {
      const wrapper = await mountSuspended(Conditions, {
        props: { conditions: [mockExhaustion], editable: true }
      })
      await wrapper.find('[data-testid="exhaustion-decrement"]').trigger('click')
      expect(wrapper.emitted('update-level')).toBeTruthy()
      expect(wrapper.emitted('update-level')![0]).toEqual([{ slug: 'core:exhaustion', level: 1 }])
    })

    it('disables increment at level 6', async () => {
      const exhaustionLevel6 = { ...mockExhaustion, level: '6' }
      const wrapper = await mountSuspended(Conditions, {
        props: { conditions: [exhaustionLevel6], editable: true }
      })
      const incrementBtn = wrapper.find('[data-testid="exhaustion-increment"]')
      expect(incrementBtn.attributes('disabled')).toBeDefined()
    })

    it('shows death warning at level 6', async () => {
      const exhaustionLevel6 = { ...mockExhaustion, level: '6' }
      const wrapper = await mountSuspended(Conditions, {
        props: { conditions: [exhaustionLevel6], editable: true }
      })
      expect(wrapper.text()).toMatch(/death/i)
    })

    it('emits add-click when add button clicked', async () => {
      const wrapper = await mountSuspended(Conditions, {
        props: { conditions: [], editable: true }
      })
      await wrapper.find('[data-testid="add-condition-btn"]').trigger('click')
      expect(wrapper.emitted('add-click')).toBeTruthy()
    })
  })
})
