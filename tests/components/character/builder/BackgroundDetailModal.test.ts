import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BackgroundDetailModal from '~/components/character/builder/BackgroundDetailModal.vue'

const mockBackground = {
  id: 1,
  slug: 'acolyte',
  name: 'Acolyte',
  feature_name: 'Shelter of the Faithful',
  feature_description: 'As an acolyte, you command respect from those who share your faith.',
  proficiencies: [
    { proficiency_type: 'skill', skill: { name: 'Insight' } },
    { proficiency_type: 'skill', skill: { name: 'Religion' } }
  ],
  languages: [
    { language: { name: 'Celestial' } },
    { language: { name: 'Infernal' } }
  ],
  equipment: [
    { item: { name: 'Holy Symbol' }, quantity: 1, is_choice: false },
    { item: { name: 'Prayer Book' }, quantity: 1, is_choice: false }
  ]
}

describe('BackgroundDetailModal', () => {
  it('displays background name in header', async () => {
    const wrapper = await mountSuspended(BackgroundDetailModal, {
      props: { background: mockBackground, open: true }
    })

    expect(wrapper.text()).toContain('Acolyte')
  })

  it('displays feature name and description', async () => {
    const wrapper = await mountSuspended(BackgroundDetailModal, {
      props: { background: mockBackground, open: true }
    })

    expect(wrapper.text()).toContain('Shelter of the Faithful')
    expect(wrapper.text()).toContain('command respect')
  })

  it('displays skill proficiencies', async () => {
    const wrapper = await mountSuspended(BackgroundDetailModal, {
      props: { background: mockBackground, open: true }
    })

    expect(wrapper.text()).toContain('Insight')
    expect(wrapper.text()).toContain('Religion')
  })

  it('displays equipment list', async () => {
    const wrapper = await mountSuspended(BackgroundDetailModal, {
      props: { background: mockBackground, open: true }
    })

    expect(wrapper.text()).toContain('Holy Symbol')
    expect(wrapper.text()).toContain('Prayer Book')
  })

  it('emits close event when close button clicked', async () => {
    const wrapper = await mountSuspended(BackgroundDetailModal, {
      props: { background: mockBackground, open: true }
    })

    await wrapper.find('[data-test="close-btn"]').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
