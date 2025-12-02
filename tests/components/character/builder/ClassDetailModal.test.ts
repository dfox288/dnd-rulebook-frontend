// tests/components/character/builder/ClassDetailModal.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import ClassDetailModal from '~/components/character/builder/ClassDetailModal.vue'
import type { CharacterClass } from '~/types'

const mockClass: CharacterClass = {
  id: 1,
  name: 'Fighter',
  slug: 'fighter',
  hit_die: 10,
  is_base_class: true,
  primary_ability: 'STR',
  description: 'A master of martial combat',
  spellcasting_ability: null,
  saving_throws: [
    { id: 1, code: 'STR', name: 'Strength' },
    { id: 2, code: 'CON', name: 'Constitution' }
  ],
  sources: []
} as CharacterClass

const mockCasterClass: CharacterClass = {
  id: 2,
  name: 'Wizard',
  slug: 'wizard',
  hit_die: 6,
  is_base_class: true,
  primary_ability: 'INT',
  description: 'A scholarly magic-user',
  spellcasting_ability: { id: 4, code: 'INT', name: 'Intelligence' },
  saving_throws: [
    { id: 4, code: 'INT', name: 'Intelligence' },
    { id: 5, code: 'WIS', name: 'Wisdom' }
  ],
  sources: []
} as CharacterClass

describe('ClassDetailModal', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders when open is true', async () => {
    const wrapper = await mountSuspended(ClassDetailModal, {
      props: { characterClass: mockClass, open: true }
    })
    expect(wrapper.text()).toContain('Fighter')
  })

  it('shows class description', async () => {
    const wrapper = await mountSuspended(ClassDetailModal, {
      props: { characterClass: mockClass, open: true }
    })
    expect(wrapper.text()).toContain('master of martial combat')
  })

  it('shows hit die', async () => {
    const wrapper = await mountSuspended(ClassDetailModal, {
      props: { characterClass: mockClass, open: true }
    })
    expect(wrapper.text()).toContain('d10')
  })

  it('shows saving throws', async () => {
    const wrapper = await mountSuspended(ClassDetailModal, {
      props: { characterClass: mockClass, open: true }
    })
    expect(wrapper.text()).toContain('Strength')
    expect(wrapper.text()).toContain('Constitution')
  })

  it('shows spellcasting info for caster classes', async () => {
    const wrapper = await mountSuspended(ClassDetailModal, {
      props: { characterClass: mockCasterClass, open: true }
    })
    expect(wrapper.text()).toContain('Spellcasting')
    expect(wrapper.text()).toContain('Intelligence')
  })

  it('does not show spellcasting section for non-casters', async () => {
    const wrapper = await mountSuspended(ClassDetailModal, {
      props: { characterClass: mockClass, open: true }
    })
    expect(wrapper.text()).not.toContain('Spellcasting Ability')
  })

  it('emits close when close button is clicked', async () => {
    const wrapper = await mountSuspended(ClassDetailModal, {
      props: { characterClass: mockClass, open: true }
    })
    await wrapper.find('[data-testid="close-btn"]').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
