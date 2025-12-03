import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SpellPickerCard from '~/components/character/builder/SpellPickerCard.vue'

const mockSpell = {
  id: 1,
  slug: 'fireball',
  name: 'Fireball',
  level: 3,
  school: { id: 5, code: 'EV', name: 'Evocation' },
  casting_time: '1 action',
  range: '150 feet',
  duration: 'Instantaneous',
  needs_concentration: false,
  is_ritual: false,
  description: 'A bright streak flashes from your pointing finger...'
}

const mockCantrip = {
  id: 2,
  slug: 'fire-bolt',
  name: 'Fire Bolt',
  level: 0,
  school: { id: 5, code: 'EV', name: 'Evocation' },
  casting_time: '1 action',
  range: '120 feet',
  duration: 'Instantaneous',
  needs_concentration: false,
  is_ritual: false,
  description: 'You hurl a mote of fire at a creature or object within range.'
}

const mockConcentrationSpell = {
  id: 3,
  slug: 'hold-person',
  name: 'Hold Person',
  level: 2,
  school: { id: 4, code: 'EN', name: 'Enchantment' },
  casting_time: '1 action',
  range: '60 feet',
  duration: 'Concentration, up to 1 minute',
  needs_concentration: true,
  is_ritual: false,
  description: 'Choose a humanoid that you can see within range.'
}

describe('SpellPickerCard', () => {
  it('displays spell name', async () => {
    const wrapper = await mountSuspended(SpellPickerCard, {
      props: { spell: mockSpell, selected: false }
    })

    expect(wrapper.text()).toContain('Fireball')
  })

  it('displays spell level for leveled spells', async () => {
    const wrapper = await mountSuspended(SpellPickerCard, {
      props: { spell: mockSpell, selected: false }
    })

    expect(wrapper.text()).toContain('3rd')
  })

  it('displays "Cantrip" for level 0 spells', async () => {
    const wrapper = await mountSuspended(SpellPickerCard, {
      props: { spell: mockCantrip, selected: false }
    })

    expect(wrapper.text()).toContain('Cantrip')
  })

  it('displays spell school', async () => {
    const wrapper = await mountSuspended(SpellPickerCard, {
      props: { spell: mockSpell, selected: false }
    })

    expect(wrapper.text()).toContain('Evocation')
  })

  it('displays concentration badge when spell requires concentration', async () => {
    const wrapper = await mountSuspended(SpellPickerCard, {
      props: { spell: mockConcentrationSpell, selected: false }
    })

    expect(wrapper.text()).toContain('Concentration')
  })

  it('does not display concentration badge for non-concentration spells', async () => {
    const wrapper = await mountSuspended(SpellPickerCard, {
      props: { spell: mockSpell, selected: false }
    })

    expect(wrapper.text()).not.toContain('Concentration')
  })

  it('shows selected state with checkmark', async () => {
    const wrapper = await mountSuspended(SpellPickerCard, {
      props: { spell: mockSpell, selected: true }
    })

    expect(wrapper.find('[data-test="selected-check"]').exists()).toBe(true)
  })

  it('does not show checkmark when not selected', async () => {
    const wrapper = await mountSuspended(SpellPickerCard, {
      props: { spell: mockSpell, selected: false }
    })

    expect(wrapper.find('[data-test="selected-check"]').exists()).toBe(false)
  })

  it('emits toggle event on click', async () => {
    const wrapper = await mountSuspended(SpellPickerCard, {
      props: { spell: mockSpell, selected: false }
    })

    await wrapper.find('[data-test="spell-card"]').trigger('click')

    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect(wrapper.emitted('toggle')![0]).toEqual([mockSpell])
  })

  it('does not emit toggle when disabled', async () => {
    const wrapper = await mountSuspended(SpellPickerCard, {
      props: { spell: mockSpell, selected: false, disabled: true }
    })

    await wrapper.find('[data-test="spell-card"]').trigger('click')

    expect(wrapper.emitted('toggle')).toBeFalsy()
  })

  it('applies disabled styling when disabled', async () => {
    const wrapper = await mountSuspended(SpellPickerCard, {
      props: { spell: mockSpell, selected: false, disabled: true }
    })

    const card = wrapper.find('[data-test="spell-card"]')
    expect(card.classes()).toContain('opacity-50')
  })

  it('emits viewDetails event when details button clicked', async () => {
    const wrapper = await mountSuspended(SpellPickerCard, {
      props: { spell: mockSpell, selected: false }
    })

    await wrapper.find('[data-test="view-details-btn"]').trigger('click')

    expect(wrapper.emitted('viewDetails')).toBeTruthy()
  })
})
