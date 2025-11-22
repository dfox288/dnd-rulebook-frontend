import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import UiAccordionBulletList from '~/components/ui/accordion/UiAccordionBulletList.vue'

describe('UiAccordionBulletList', () => {
  const mockItems = [
    {
      id: 1,
      proficiency_name: 'Stealth',
      proficiency_type: 'skill',
      proficiency_subcategory: null,
      proficiency_type_id: 1,
      grants: true,
      is_choice: false,
      quantity: 1
    },
    {
      id: 2,
      proficiency_name: 'Perception',
      proficiency_type: 'skill',
      proficiency_subcategory: null,
      proficiency_type_id: 2,
      grants: true,
      is_choice: false,
      quantity: 1
    },
    {
      id: 3,
      proficiency_name: 'Athletics',
      proficiency_type: 'skill',
      proficiency_subcategory: null,
      proficiency_type_id: 3,
      grants: true,
      is_choice: false,
      quantity: 1
    }
  ]

  it('renders bullet list with proficiency names', async () => {
    const wrapper = await mountSuspended(UiAccordionBulletList, {
      props: { items: mockItems }
    })

    const text = wrapper.text()
    expect(text).toContain('• Stealth')
    expect(text).toContain('• Perception')
    expect(text).toContain('• Athletics')
  })

  it('uses proficiency_type_detail.name when proficiency_name is not available', async () => {
    const itemsWithDetailName = [
      {
        id: 1,
        proficiency_name: null,
        proficiency_type: 'skill',
        proficiency_subcategory: null,
        proficiency_type_id: 1,
        proficiency_type_detail: { id: 1, name: 'Common' },
        grants: true,
        is_choice: false,
        quantity: 1
      },
      {
        id: 2,
        proficiency_name: null,
        proficiency_type: 'skill',
        proficiency_subcategory: null,
        proficiency_type_id: 2,
        proficiency_type_detail: { id: 2, name: 'Elvish' },
        grants: true,
        is_choice: false,
        quantity: 1
      }
    ]

    const wrapper = await mountSuspended(UiAccordionBulletList, {
      props: { items: itemsWithDetailName }
    })

    const text = wrapper.text()
    expect(text).toContain('• Common')
    expect(text).toContain('• Elvish')
  })

  it('prefers proficiency_name over proficiency_type_detail.name when both are present', async () => {
    const itemsWithBoth = [
      {
        id: 1,
        proficiency_name: 'Tool Proficiency: Smith\'s Tools',
        proficiency_type: 'tool',
        proficiency_subcategory: null,
        proficiency_type_id: 1,
        proficiency_type_detail: { id: 1, name: 'Smith\'s Tools' },
        grants: true,
        is_choice: false,
        quantity: 1
      }
    ]

    const wrapper = await mountSuspended(UiAccordionBulletList, {
      props: { items: itemsWithBoth }
    })

    const text = wrapper.text()
    expect(text).toContain('• Tool Proficiency: Smith\'s Tools')
    expect(text).not.toContain('• Smith\'s Tools')
  })

  it('renders empty state when items array is empty', async () => {
    const wrapper = await mountSuspended(UiAccordionBulletList, {
      props: { items: [] }
    })

    // Should render container but no bullets
    expect(wrapper.find('.p-4').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('•')
  })

  it('renders correct number of items', async () => {
    const wrapper = await mountSuspended(UiAccordionBulletList, {
      props: { items: mockItems }
    })

    const bullets = wrapper.text().match(/•/g)
    expect(bullets).toBeTruthy()
    expect(bullets!.length).toBe(3)
  })

  it('applies correct styling classes', async () => {
    const wrapper = await mountSuspended(UiAccordionBulletList, {
      props: { items: mockItems }
    })

    // Check container styling
    const container = wrapper.find('.p-4')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('space-y-2')

    // Check item styling
    const items = wrapper.findAll('.text-gray-700')
    expect(items.length).toBe(3)
  })

  it('uses id as key for v-for rendering', async () => {
    const wrapper = await mountSuspended(UiAccordionBulletList, {
      props: { items: mockItems }
    })

    // Verify all items rendered (indirect check via text content)
    const text = wrapper.text()
    mockItems.forEach((item) => {
      expect(text).toContain(item.proficiency_name!)
    })
  })

  it('handles single item correctly', async () => {
    const singleItem = [
      {
        id: 1,
        proficiency_name: 'Investigation',
        proficiency_type: 'skill',
        proficiency_subcategory: null,
        proficiency_type_id: 1,
        grants: true,
        is_choice: false,
        quantity: 1
      }
    ]

    const wrapper = await mountSuspended(UiAccordionBulletList, {
      props: { items: singleItem }
    })

    const text = wrapper.text()
    expect(text).toContain('• Investigation')
    const bullets = text.match(/•/g)
    expect(bullets!.length).toBe(1)
  })

  it('handles items with long names', async () => {
    const longNameItems = [
      {
        id: 1,
        proficiency_name: 'Tool Proficiency: Thieves\' Tools (includes lockpicking and disarming traps)',
        proficiency_type: 'tool',
        proficiency_subcategory: null,
        proficiency_type_id: 1,
        grants: true,
        is_choice: false,
        quantity: 1
      }
    ]

    const wrapper = await mountSuspended(UiAccordionBulletList, {
      props: { items: longNameItems }
    })

    const text = wrapper.text()
    expect(text).toContain('Tool Proficiency: Thieves\' Tools')
  })

  it('supports dark mode styling', async () => {
    const wrapper = await mountSuspended(UiAccordionBulletList, {
      props: { items: mockItems }
    })

    const items = wrapper.findAll('.text-gray-700')
    items.forEach((item) => {
      expect(item.classes()).toContain('dark:text-gray-300')
    })
  })
})
