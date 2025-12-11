// tests/components/character/levelup/LevelUpWizard.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'

// =============================================================================
// MOCK SETUP
// =============================================================================

const mockCloseWizard = vi.fn()
const mockGoToStep = vi.fn()
const mockRefreshChoices = vi.fn()

const mockIsOpen = ref(true)
const mockCurrentStepName = ref('hit-points')
const mockIsLoading = ref(false)
const mockError = ref<string | null>(null)
const mockLevelUpResult = ref(null)
const mockCharacterClasses = ref([
  { class: { id: 1, name: 'Fighter', slug: 'fighter', hit_die: 10 }, level: 3 }
])
const mockNeedsClassSelection = ref(false)
const mockPendingChoices = ref<any[]>([])
const mockHasSpellChoices = ref(false)
const mockHasFeatureChoices = ref(false)
const mockHasLanguageChoices = ref(false)
const mockHasProficiencyChoices = ref(false)

vi.mock('~/stores/characterLevelUp', () => ({
  useCharacterLevelUpStore: vi.fn(() => ({
    get isOpen() { return mockIsOpen.value },
    set isOpen(v: boolean) { mockIsOpen.value = v },
    get currentStepName() { return mockCurrentStepName.value },
    get isLoading() { return mockIsLoading.value },
    get error() { return mockError.value },
    get levelUpResult() { return mockLevelUpResult.value },
    get characterClasses() { return mockCharacterClasses.value },
    get publicId() { return 'test-char-xxxx' },
    get characterId() { return 1 },
    get selectedClassSlug() { return 'phb:fighter' },
    get needsClassSelection() { return mockNeedsClassSelection.value },
    get pendingChoices() { return mockPendingChoices.value },
    get hasSpellChoices() { return mockHasSpellChoices.value },
    get hasFeatureChoices() { return mockHasFeatureChoices.value },
    get hasLanguageChoices() { return mockHasLanguageChoices.value },
    get hasProficiencyChoices() { return mockHasProficiencyChoices.value },
    closeWizard: mockCloseWizard,
    goToStep: mockGoToStep,
    refreshChoices: mockRefreshChoices
  }))
}))

vi.mock('~/composables/useLevelUpWizard', () => ({
  useLevelUpWizard: vi.fn(() => ({
    stepRegistry: [
      { name: 'hit-points', label: 'Hit Points', icon: 'i-heroicons-heart', visible: () => true },
      { name: 'summary', label: 'Summary', icon: 'i-heroicons-trophy', visible: () => true }
    ],
    activeSteps: ref([
      { name: 'hit-points', label: 'Hit Points', icon: 'i-heroicons-heart' },
      { name: 'summary', label: 'Summary', icon: 'i-heroicons-trophy' }
    ]),
    currentStepIndex: ref(0),
    progressPercent: ref(0),
    nextStep: vi.fn(),
    previousStep: vi.fn(),
    goToStep: mockGoToStep
  }))
}))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    apiFetch: vi.fn().mockResolvedValue({ data: { constitution_modifier: 2 } })
  })
}))

vi.mock('~/composables/useUnifiedChoices', () => ({
  useUnifiedChoices: () => ({
    choices: ref([]),
    choicesByType: ref({
      hitPoints: [],
      spells: [],
      proficiencies: [],
      languages: [],
      fightingStyles: [],
      expertise: [],
      optionalFeatures: []
    }),
    pending: ref(false),
    pendingCount: ref(0),
    error: ref(null),
    fetchChoices: vi.fn().mockResolvedValue(undefined),
    resolveChoice: vi.fn().mockResolvedValue(undefined),
    clearChoices: vi.fn()
  })
}))

vi.mock('~/composables/useWizardChoiceSelection', () => ({
  useWizardChoiceSelection: () => ({
    localSelections: ref(new Map()),
    isSaving: ref(false),
    getSelectedCount: vi.fn().mockReturnValue(0),
    isOptionSelected: vi.fn().mockReturnValue(false),
    isOptionDisabled: vi.fn().mockReturnValue(false),
    getDisabledReason: vi.fn().mockReturnValue(null),
    allComplete: ref(true),
    handleToggle: vi.fn(),
    getDisplayOptions: vi.fn().mockReturnValue([]),
    fetchOptionsIfNeeded: vi.fn().mockResolvedValue(undefined),
    saveAllChoices: vi.fn().mockResolvedValue(undefined)
  })
}))

// Import component AFTER mocks
// eslint-disable-next-line import/first
import LevelUpWizard from '~/components/character/levelup/LevelUpWizard.vue'

// =============================================================================
// TESTS
// =============================================================================

describe('LevelUpWizard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockIsOpen.value = true
    mockCurrentStepName.value = 'hit-points'
    mockIsLoading.value = false
    mockError.value = null
  })

  it('renders when open', async () => {
    const wrapper = await mountSuspended(LevelUpWizard)

    expect(wrapper.find('[data-testid="level-up-wizard"]').exists()).toBe(true)
  })

  it('shows sidebar', async () => {
    const wrapper = await mountSuspended(LevelUpWizard)

    expect(wrapper.find('[data-testid="level-up-sidebar"]').exists()).toBe(true)
  })

  it('has close button', async () => {
    const wrapper = await mountSuspended(LevelUpWizard)

    expect(wrapper.find('[data-testid="close-button"]').exists()).toBe(true)
  })

  it('calls closeWizard when close button clicked', async () => {
    const wrapper = await mountSuspended(LevelUpWizard)

    await wrapper.find('[data-testid="close-button"]').trigger('click')
    expect(mockCloseWizard).toHaveBeenCalled()
  })

  it('shows error alert when error is set', async () => {
    mockError.value = 'Something went wrong'
    const wrapper = await mountSuspended(LevelUpWizard)

    expect(wrapper.text()).toContain('Something went wrong')
  })

  it('shows loading spinner when loading', async () => {
    mockIsLoading.value = true
    const wrapper = await mountSuspended(LevelUpWizard)

    expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(true)
  })

  it('displays wizard title', async () => {
    const wrapper = await mountSuspended(LevelUpWizard)

    expect(wrapper.text()).toContain('Level Up')
  })
})

// =============================================================================
// NEW STEP COMPONENT TESTS (Task 4.1)
// =============================================================================

describe('LevelUpWizard - new choice steps', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockIsOpen.value = true
    mockIsLoading.value = false
    mockError.value = null
  })

  describe('Feature Choices Step', () => {
    it('renders StepFeatureChoices when on feature-choices step', async () => {
      mockCurrentStepName.value = 'feature-choices'
      mockHasFeatureChoices.value = true
      mockPendingChoices.value = [{ id: 'fs-1', type: 'fighting_style', quantity: 1 }]

      const wrapper = await mountSuspended(LevelUpWizard)

      const stepComponent = wrapper.findComponent({ name: 'CharacterWizardStepFeatureChoices' })
      expect(stepComponent.exists()).toBe(true)
    })

    it('passes characterId prop to StepFeatureChoices', async () => {
      mockCurrentStepName.value = 'feature-choices'
      mockHasFeatureChoices.value = true

      const wrapper = await mountSuspended(LevelUpWizard)
      const stepComponent = wrapper.findComponent({ name: 'CharacterWizardStepFeatureChoices' })

      expect(stepComponent.props('characterId')).toBe(1)
    })

    it('passes nextStep handler to StepFeatureChoices', async () => {
      mockCurrentStepName.value = 'feature-choices'
      mockHasFeatureChoices.value = true

      const wrapper = await mountSuspended(LevelUpWizard)
      const stepComponent = wrapper.findComponent({ name: 'CharacterWizardStepFeatureChoices' })

      expect(stepComponent.props('nextStep')).toBeDefined()
      expect(typeof stepComponent.props('nextStep')).toBe('function')
    })
  })

  describe('Spells Step', () => {
    it('renders StepSpells when on spells step', async () => {
      mockCurrentStepName.value = 'spells'
      mockHasSpellChoices.value = true
      mockPendingChoices.value = [{ id: 'spell-1', type: 'spell', quantity: 2 }]

      const wrapper = await mountSuspended(LevelUpWizard)

      const stepComponent = wrapper.findComponent({ name: 'CharacterWizardStepSpells' })
      expect(stepComponent.exists()).toBe(true)
    })

    it('passes characterId prop to StepSpells', async () => {
      mockCurrentStepName.value = 'spells'
      mockHasSpellChoices.value = true

      const wrapper = await mountSuspended(LevelUpWizard)
      const stepComponent = wrapper.findComponent({ name: 'CharacterWizardStepSpells' })

      expect(stepComponent.props('characterId')).toBe(1)
    })

    it('passes nextStep handler to StepSpells', async () => {
      mockCurrentStepName.value = 'spells'
      mockHasSpellChoices.value = true

      const wrapper = await mountSuspended(LevelUpWizard)
      const stepComponent = wrapper.findComponent({ name: 'CharacterWizardStepSpells' })

      expect(stepComponent.props('nextStep')).toBeDefined()
      expect(typeof stepComponent.props('nextStep')).toBe('function')
    })
  })

  describe('Languages Step', () => {
    it('renders StepLanguages when on languages step', async () => {
      mockCurrentStepName.value = 'languages'
      mockHasLanguageChoices.value = true
      mockPendingChoices.value = [{ id: 'lang-1', type: 'language', quantity: 1 }]

      const wrapper = await mountSuspended(LevelUpWizard)

      const stepComponent = wrapper.findComponent({ name: 'CharacterWizardStepLanguages' })
      expect(stepComponent.exists()).toBe(true)
    })

    it('passes characterId prop to StepLanguages', async () => {
      mockCurrentStepName.value = 'languages'
      mockHasLanguageChoices.value = true

      const wrapper = await mountSuspended(LevelUpWizard)
      const stepComponent = wrapper.findComponent({ name: 'CharacterWizardStepLanguages' })

      expect(stepComponent.props('characterId')).toBe(1)
    })

    it('passes nextStep handler to StepLanguages', async () => {
      mockCurrentStepName.value = 'languages'
      mockHasLanguageChoices.value = true

      const wrapper = await mountSuspended(LevelUpWizard)
      const stepComponent = wrapper.findComponent({ name: 'CharacterWizardStepLanguages' })

      expect(stepComponent.props('nextStep')).toBeDefined()
      expect(typeof stepComponent.props('nextStep')).toBe('function')
    })
  })

  describe('Proficiencies Step', () => {
    it('renders StepProficiencies when on proficiencies step', async () => {
      mockCurrentStepName.value = 'proficiencies'
      mockHasProficiencyChoices.value = true
      mockPendingChoices.value = [{ id: 'prof-1', type: 'proficiency', quantity: 2 }]

      const wrapper = await mountSuspended(LevelUpWizard)

      const stepComponent = wrapper.findComponent({ name: 'CharacterWizardStepProficiencies' })
      expect(stepComponent.exists()).toBe(true)
    })

    it('passes characterId prop to StepProficiencies', async () => {
      mockCurrentStepName.value = 'proficiencies'
      mockHasProficiencyChoices.value = true

      const wrapper = await mountSuspended(LevelUpWizard)
      const stepComponent = wrapper.findComponent({ name: 'CharacterWizardStepProficiencies' })

      expect(stepComponent.props('characterId')).toBe(1)
    })

    it('passes nextStep handler to StepProficiencies', async () => {
      mockCurrentStepName.value = 'proficiencies'
      mockHasProficiencyChoices.value = true

      const wrapper = await mountSuspended(LevelUpWizard)
      const stepComponent = wrapper.findComponent({ name: 'CharacterWizardStepProficiencies' })

      expect(stepComponent.props('nextStep')).toBeDefined()
      expect(typeof stepComponent.props('nextStep')).toBe('function')
    })
  })
})
