// tests/pages/characters/edit.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { ref, computed } from 'vue'

// Mock the store with proper refs for storeToRefs
const mockLoadCharacterForEditing = vi.fn()
const mockReset = vi.fn()

vi.mock('~/stores/characterBuilder', () => ({
  useCharacterBuilderStore: () => ({
    loadCharacterForEditing: mockLoadCharacterForEditing,
    reset: mockReset,
    currentStep: ref(1),
    isFirstStep: computed(() => true),
    isLastStep: computed(() => false),
    isCaster: computed(() => false),
    isLoading: ref(false),
    error: ref(null),
    name: ref('Test Character'),
    characterId: ref(42),
    previousStep: vi.fn(),
    nextStep: vi.fn()
  })
}))

// Mock vue-router
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRoute: vi.fn(() => ({
      params: { id: '42' }
    }))
  }
})

describe('CharacterEditPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockLoadCharacterForEditing.mockReset()
    mockReset.mockReset()
  })

  it('calls loadCharacterForEditing on mount', async () => {
    mockLoadCharacterForEditing.mockResolvedValue(undefined)

    const CharacterEditPage = await import('~/pages/characters/[id]/edit.vue')
    await mountSuspended(CharacterEditPage.default, {
      route: '/characters/42/edit'
    })
    await flushPromises()

    expect(mockReset).toHaveBeenCalled()
    expect(mockLoadCharacterForEditing).toHaveBeenCalledWith(42)
  })

  it('displays page title "Edit Character"', async () => {
    mockLoadCharacterForEditing.mockResolvedValue(undefined)

    const CharacterEditPage = await import('~/pages/characters/[id]/edit.vue')
    const wrapper = await mountSuspended(CharacterEditPage.default, {
      route: '/characters/42/edit'
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Edit Character')
  })

  it('displays character name in subtitle', async () => {
    mockLoadCharacterForEditing.mockResolvedValue(undefined)

    const CharacterEditPage = await import('~/pages/characters/[id]/edit.vue')
    const wrapper = await mountSuspended(CharacterEditPage.default, {
      route: '/characters/42/edit'
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Test Character')
  })
})
