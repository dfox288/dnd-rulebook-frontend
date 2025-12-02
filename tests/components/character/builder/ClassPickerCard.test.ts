// tests/components/character/builder/ClassPickerCard.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import ClassPickerCard from '~/components/character/builder/ClassPickerCard.vue'
import type { CharacterClass } from '~/types'

const mockClass: CharacterClass = {
  id: 1,
  name: 'Fighter',
  slug: 'fighter',
  hit_die: 10,
  is_base_class: true,
  primary_ability: 'STR',
  spellcasting_ability: null,
  sources: []
} as CharacterClass

const mockCasterClass: CharacterClass = {
  id: 2,
  name: 'Wizard',
  slug: 'wizard',
  hit_die: 6,
  is_base_class: true,
  primary_ability: 'INT',
  spellcasting_ability: { id: 4, code: 'INT', name: 'Intelligence' },
  sources: []
} as CharacterClass

describe('ClassPickerCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the class name', async () => {
    const wrapper = await mountSuspended(ClassPickerCard, {
      props: { characterClass: mockClass, selected: false }
    })
    expect(wrapper.text()).toContain('Fighter')
  })

  it('shows hit die', async () => {
    const wrapper = await mountSuspended(ClassPickerCard, {
      props: { characterClass: mockClass, selected: false }
    })
    expect(wrapper.text()).toContain('d10')
  })

  it('shows selected styling when selected', async () => {
    const wrapper = await mountSuspended(ClassPickerCard, {
      props: { characterClass: mockClass, selected: true }
    })
    expect(wrapper.find('[data-testid="picker-card"]').classes()).toContain('ring-2')
  })

  it('does not show selected styling when not selected', async () => {
    const wrapper = await mountSuspended(ClassPickerCard, {
      props: { characterClass: mockClass, selected: false }
    })
    expect(wrapper.find('[data-testid="picker-card"]').classes()).not.toContain('ring-2')
  })

  it('emits select event when card is clicked', async () => {
    const wrapper = await mountSuspended(ClassPickerCard, {
      props: { characterClass: mockClass, selected: false }
    })
    await wrapper.find('[data-testid="picker-card"]').trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')![0]).toEqual([mockClass])
  })

  it('shows View Details button', async () => {
    const wrapper = await mountSuspended(ClassPickerCard, {
      props: { characterClass: mockClass, selected: false }
    })
    expect(wrapper.text()).toContain('View Details')
  })

  it('emits view-details event when View Details button is clicked', async () => {
    const wrapper = await mountSuspended(ClassPickerCard, {
      props: { characterClass: mockClass, selected: false }
    })
    await wrapper.find('[data-testid="view-details-btn"]').trigger('click')
    expect(wrapper.emitted('view-details')).toBeTruthy()
    expect(wrapper.emitted('select')).toBeFalsy()
  })

  it('shows spellcasting indicator for caster classes', async () => {
    const wrapper = await mountSuspended(ClassPickerCard, {
      props: { characterClass: mockCasterClass, selected: false }
    })
    expect(wrapper.text()).toContain('Intelligence')
  })

  it('does not show spellcasting indicator for non-caster classes', async () => {
    const wrapper = await mountSuspended(ClassPickerCard, {
      props: { characterClass: mockClass, selected: false }
    })
    expect(wrapper.text()).not.toContain('Spellcasting')
  })
})
