import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BackgroundQuickStats from '~/components/background/BackgroundQuickStats.vue'

describe('BackgroundQuickStats', () => {
  // Skill-related tests
  it('renders skills with ability codes', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [
          { name: 'Insight', abilityCode: 'WIS' },
          { name: 'Religion', abilityCode: 'INT' }
        ],
        languageDisplay: '2 of your choice',
        toolProficiencies: [],
        startingGold: null,
        equipmentCount: 0
      }
    })

    const text = wrapper.text()
    expect(text).toContain('Insight (WIS)')
    expect(text).toContain('Religion (INT)')
  })

  it('renders skills without ability codes when null', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [
          { name: 'Insight', abilityCode: null },
          { name: 'Religion', abilityCode: null }
        ],
        languageDisplay: '2 of your choice',
        toolProficiencies: [],
        startingGold: null,
        equipmentCount: 0
      }
    })

    const text = wrapper.text()
    expect(text).toContain('Insight')
    expect(text).toContain('Religion')
    // Should not show parentheses when no ability code
    expect(text).not.toContain('()')
  })

  it('hides skills section when empty', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: '2 of your choice',
        toolProficiencies: [],
        startingGold: null,
        equipmentCount: 0
      }
    })

    expect(wrapper.text()).not.toContain('Skills')
  })

  // Language-related tests
  it('renders language display string', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: '2 of your choice',
        toolProficiencies: [],
        startingGold: null,
        equipmentCount: 0
      }
    })

    expect(wrapper.text()).toContain('2 of your choice')
  })

  it('handles specific language lists', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: 'Elvish, Dwarvish',
        toolProficiencies: [],
        startingGold: null,
        equipmentCount: 0
      }
    })

    expect(wrapper.text()).toContain('Elvish, Dwarvish')
  })

  it('hides languages section when display is empty', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: '',
        toolProficiencies: [],
        startingGold: null,
        equipmentCount: 0
      }
    })

    expect(wrapper.text()).not.toContain('Languages')
  })

  // Tool proficiencies tests
  it('renders tool proficiencies when present', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: '',
        toolProficiencies: ['Thieves\' Tools', 'Disguise Kit'],
        startingGold: null,
        equipmentCount: 0
      }
    })

    const text = wrapper.text()
    expect(text).toContain('Thieves\' Tools')
    expect(text).toContain('Disguise Kit')
  })

  it('hides tool proficiencies section when empty', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: '',
        toolProficiencies: [],
        startingGold: null,
        equipmentCount: 0
      }
    })

    expect(wrapper.text()).not.toContain('Tools')
  })

  // Starting gold tests
  it('renders starting gold when present', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: '',
        toolProficiencies: [],
        startingGold: 10,
        equipmentCount: 0
      }
    })

    expect(wrapper.text()).toContain('10 gp')
  })

  it('hides starting gold section when null', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: '',
        toolProficiencies: [],
        startingGold: null,
        equipmentCount: 0
      }
    })

    // Should not show "gp" or gold-related text
    expect(wrapper.text()).not.toContain('gp')
    expect(wrapper.text()).not.toContain('Gold')
  })

  it('hides starting gold section when 0', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: '',
        toolProficiencies: [],
        startingGold: 0,
        equipmentCount: 0
      }
    })

    expect(wrapper.text()).not.toContain('gp')
  })

  // Layout tests
  it('uses academic-cap icon for skills', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [{ name: 'Insight', abilityCode: 'WIS' }],
        languageDisplay: '',
        toolProficiencies: [],
        startingGold: null,
        equipmentCount: 0
      }
    })

    expect(wrapper.html()).toContain('i-heroicons-academic-cap')
  })

  it('uses language icon for languages', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: 'Common, Elvish',
        toolProficiencies: [],
        startingGold: null,
        equipmentCount: 0
      }
    })

    expect(wrapper.html()).toContain('i-heroicons-language')
  })

  it('uses wrench icon for tools', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: '',
        toolProficiencies: ['Thieves\' Tools'],
        startingGold: null,
        equipmentCount: 0
      }
    })

    expect(wrapper.html()).toContain('i-heroicons-wrench')
  })

  it('uses banknotes icon for gold', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: '',
        toolProficiencies: [],
        startingGold: 15,
        equipmentCount: 0
      }
    })

    expect(wrapper.html()).toContain('i-heroicons-banknotes')
  })

  // Integration test - full component
  it('renders all sections when all data present', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [
          { name: 'Insight', abilityCode: 'WIS' },
          { name: 'Religion', abilityCode: 'INT' }
        ],
        languageDisplay: '2 of your choice',
        toolProficiencies: ['Thieves\' Tools'],
        startingGold: 15,
        equipmentCount: 5
      }
    })

    const text = wrapper.text()
    expect(text).toContain('Insight (WIS)')
    expect(text).toContain('Religion (INT)')
    expect(text).toContain('2 of your choice')
    expect(text).toContain('Thieves\' Tools')
    expect(text).toContain('5 items')
    expect(text).toContain('15 gp')
  })

  it('renders empty state gracefully when no data', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: '',
        toolProficiencies: [],
        startingGold: null,
        equipmentCount: 0
      }
    })

    // Should render but be empty (UCard should still exist)
    expect(wrapper.html()).toBeTruthy()
  })

  // Equipment count tests
  it('renders starting items count when present', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: '',
        toolProficiencies: [],
        startingGold: null,
        equipmentCount: 6
      }
    })

    expect(wrapper.text()).toContain('6 items')
  })

  it('shows singular "item" when count is 1', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: '',
        toolProficiencies: [],
        startingGold: null,
        equipmentCount: 1
      }
    })

    expect(wrapper.text()).toContain('1 item')
    expect(wrapper.text()).not.toContain('1 items')
  })

  it('hides starting items section when count is 0', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: '',
        toolProficiencies: [],
        startingGold: null,
        equipmentCount: 0
      }
    })

    expect(wrapper.text()).not.toContain('items')
    expect(wrapper.text()).not.toContain('Starting Items')
  })

  it('uses cube icon for starting items', async () => {
    const wrapper = await mountSuspended(BackgroundQuickStats, {
      props: {
        skills: [],
        languageDisplay: '',
        toolProficiencies: [],
        startingGold: null,
        equipmentCount: 3
      }
    })

    expect(wrapper.html()).toContain('i-heroicons-cube')
  })
})
