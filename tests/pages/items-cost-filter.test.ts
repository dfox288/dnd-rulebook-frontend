import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { PaginatedResponse, Item } from '~/types/api'
import ItemsIndexPage from '~/pages/items/index.vue'

describe('Items Cost Filter', () => {
  it('has cost range filter state', async () => {
    const wrapper = await mountSuspended(ItemsIndexPage)

    const component = wrapper.vm as any

    // Should have selectedCostRange ref
    expect(component.selectedCostRange).toBeDefined()
    expect(component.selectedCostRange).toBeNull()
  })

  it('has correct cost range options', async () => {
    const wrapper = await mountSuspended(ItemsIndexPage)

    const component = wrapper.vm as any

    // Should have costRangeOptions
    expect(component.costRangeOptions).toBeDefined()
    expect(Array.isArray(component.costRangeOptions)).toBe(true)
    expect(component.costRangeOptions.length).toBe(6)

    // Verify option labels
    const labels = component.costRangeOptions.map((o: any) => o.label)
    expect(labels).toContain('All Prices')
    expect(labels).toContain('Under 1 gp')
    expect(labels).toContain('1-10 gp')
    expect(labels).toContain('10-100 gp')
    expect(labels).toContain('100-1000 gp')
    expect(labels).toContain('1000+ gp')
  })

  it('shows cost range filter chip when cost is selected', async () => {
    const wrapper = await mountSuspended(ItemsIndexPage)

    const component = wrapper.vm as any
    component.selectedCostRange = '100-1000'
    await wrapper.vm.$nextTick()

    const chips = wrapper.findAll('button').filter(btn =>
      btn.text().includes('1-10 gp') && btn.text().includes('✕')
    )
    expect(chips.length).toBeGreaterThan(0)
  })

  it('clicking cost range chip clears the filter', async () => {
    const wrapper = await mountSuspended(ItemsIndexPage)

    const component = wrapper.vm as any
    component.selectedCostRange = '100-1000'
    await wrapper.vm.$nextTick()

    const chip = wrapper.findAll('button').find(btn =>
      btn.text().includes('1-10 gp') && btn.text().includes('✕')
    )
    expect(chip).toBeDefined()
    await chip!.trigger('click')

    expect(component.selectedCostRange).toBeNull()
  })
})

describe('Items Cost Filter - Query Generation', () => {
  it('generates correct filter for Under 1 gp', async () => {
    const wrapper = await mountSuspended(ItemsIndexPage)
    const component = wrapper.vm as any

    component.selectedCostRange = 'under-100'
    await wrapper.vm.$nextTick()

    const queryParams = component.queryBuilder
    expect(queryParams.filter).toContain('cost_cp < 100')
  })

  it('generates correct filter for 1-10 gp', async () => {
    const wrapper = await mountSuspended(ItemsIndexPage)
    const component = wrapper.vm as any

    component.selectedCostRange = '100-1000'
    await wrapper.vm.$nextTick()

    const queryParams = component.queryBuilder
    expect(queryParams.filter).toContain('cost_cp >= 100 AND cost_cp <= 1000')
  })

  it('generates correct filter for 100-1000 gp', async () => {
    const wrapper = await mountSuspended(ItemsIndexPage)
    const component = wrapper.vm as any

    component.selectedCostRange = '10000-100000'
    await wrapper.vm.$nextTick()

    const queryParams = component.queryBuilder
    expect(queryParams.filter).toContain('cost_cp >= 10000 AND cost_cp <= 100000')
  })

  it('generates correct filter for 1000+ gp', async () => {
    const wrapper = await mountSuspended(ItemsIndexPage)
    const component = wrapper.vm as any

    component.selectedCostRange = 'over-100000'
    await wrapper.vm.$nextTick()

    const queryParams = component.queryBuilder
    expect(queryParams.filter).toContain('cost_cp >= 100000')
  })

  it('does not include filter when null', async () => {
    const wrapper = await mountSuspended(ItemsIndexPage)
    const component = wrapper.vm as any

    component.selectedCostRange = null
    await wrapper.vm.$nextTick()

    const queryParams = component.queryBuilder
    // Should not have cost_cp in filter
    if (queryParams.filter) {
      expect(queryParams.filter).not.toContain('cost_cp')
    }
  })
})
