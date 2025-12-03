// tests/pages/characters/edit.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { ref, computed } from 'vue'

// Mock the store with proper refs for storeToRefs
const mockLoadCharacterForEditing = vi.fn()
const mockReset = vi.fn()
const mockGoToStep = vi.fn()

vi.mock('~/stores/characterBuilder', () => ({
  useCharacterBuilderStore: () => ({
    loadCharacterForEditing: mockLoadCharacterForEditing,
    reset: mockReset,
    goToStep: mockGoToStep,
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
      params: { id: '42' },
      query: {}
    }))
  }
})

describe('CharacterEditPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockLoadCharacterForEditing.mockReset()
    mockReset.mockReset()
    mockGoToStep.mockReset()
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

describe('CharacterEditPage - New Character Flow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockLoadCharacterForEditing.mockReset()
    mockReset.mockReset()
    mockGoToStep.mockReset()
  })

  it('forces step 1 when ?new=true query parameter is present', async () => {
    mockLoadCharacterForEditing.mockResolvedValue(undefined)

    // Mock useRoute to include query param
    const { useRoute } = await import('vue-router')
    vi.mocked(useRoute).mockReturnValue({
      params: { id: '42' },
      query: { new: 'true' }
    } as ReturnType<typeof useRoute>)

    const CharacterEditPage = await import('~/pages/characters/[id]/edit.vue')
    await mountSuspended(CharacterEditPage.default, {
      route: '/characters/42/edit?new=true'
    })
    await flushPromises()

    // Should call goToStep(1) after loading to force step 1
    expect(mockGoToStep).toHaveBeenCalledWith(1)
  })
})
