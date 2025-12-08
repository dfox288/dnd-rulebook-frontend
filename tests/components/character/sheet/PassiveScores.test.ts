// tests/components/character/sheet/PassiveScores.test.ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PassiveScores from '~/components/character/sheet/PassiveScores.vue'

describe('CharacterSheetPassiveScores', () => {
  it('displays all three passive scores', async () => {
    const wrapper = await mountSuspended(PassiveScores, {
      props: {
        perception: 14,
        investigation: 10,
        insight: 12
      }
    })
    expect(wrapper.text()).toContain('Passive')
    expect(wrapper.text()).toContain('Perception')
    expect(wrapper.text()).toContain('14')
    expect(wrapper.text()).toContain('Investigation')
    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('Insight')
    expect(wrapper.text()).toContain('12')
  })

  it('handles null perception gracefully', async () => {
    const wrapper = await mountSuspended(PassiveScores, {
      props: {
        perception: null,
        investigation: 10,
        insight: 12
      }
    })
    expect(wrapper.text()).toContain('—')
    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('12')
  })

  it('handles null investigation gracefully', async () => {
    const wrapper = await mountSuspended(PassiveScores, {
      props: {
        perception: 14,
        investigation: null,
        insight: 12
      }
    })
    expect(wrapper.text()).toContain('14')
    expect(wrapper.text()).toContain('—')
    expect(wrapper.text()).toContain('12')
  })

  it('handles null insight gracefully', async () => {
    const wrapper = await mountSuspended(PassiveScores, {
      props: {
        perception: 14,
        investigation: 10,
        insight: null
      }
    })
    expect(wrapper.text()).toContain('14')
    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('—')
  })

  it('handles all null values gracefully', async () => {
    const wrapper = await mountSuspended(PassiveScores, {
      props: {
        perception: null,
        investigation: null,
        insight: null
      }
    })
    const dashMatches = wrapper.text().match(/—/g)
    expect(dashMatches).toBeTruthy()
    expect(dashMatches!.length).toBe(3)
  })
})
