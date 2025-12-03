import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import StepEquipment from '~/components/character/builder/StepEquipment.vue'
import { useCharacterBuilderStore } from '~/stores/characterBuilder'

describe('StepEquipment', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('displays class equipment section', async () => {
    const wrapper = await mountSuspended(StepEquipment)

    const store = useCharacterBuilderStore()
    store.selectedClass = {
      name: 'Fighter',
      equipment: [
        { id: 1, item_id: 1, item: { name: 'Chain Mail' }, quantity: 1, is_choice: false }
      ]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Fighter')
    expect(wrapper.text()).toContain('Chain Mail')
  })

  it('displays background equipment section', async () => {
    const wrapper = await mountSuspended(StepEquipment)

    const store = useCharacterBuilderStore()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.selectedClass = { name: 'Fighter', equipment: [] } as any
    store.selectedBackground = {
      name: 'Soldier',
      equipment: [
        { id: 2, item_id: 2, item: { name: 'Insignia of Rank' }, quantity: 1, is_choice: false }
      ]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Soldier')
    expect(wrapper.text()).toContain('Insignia of Rank')
  })

  it('displays equipment choice groups', async () => {
    const wrapper = await mountSuspended(StepEquipment)

    const store = useCharacterBuilderStore()
    store.selectedClass = {
      name: 'Fighter',
      equipment: [
        { id: 1, item_id: 101, item: { name: 'Longsword' }, quantity: 1, is_choice: true, choice_group: 'weapon' },
        { id: 2, item_id: 102, item: { name: 'Rapier' }, quantity: 1, is_choice: true, choice_group: 'weapon' }
      ]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Longsword')
    expect(wrapper.text()).toContain('Rapier')
  })

  it('disables continue button until all choices made', async () => {
    const wrapper = await mountSuspended(StepEquipment)

    const store = useCharacterBuilderStore()
    store.selectedClass = {
      name: 'Fighter',
      equipment: [
        { id: 1, item_id: 101, item: { name: 'Longsword' }, is_choice: true, choice_group: 'weapon' }
      ]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any

    await wrapper.vm.$nextTick()

    const button = wrapper.find('[data-test="continue-btn"]')
    expect(button.attributes('disabled')).toBeDefined()
  })
})
