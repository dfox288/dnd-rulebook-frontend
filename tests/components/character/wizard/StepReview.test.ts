import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import { ref, computed } from 'vue'
import StepReview from '~/components/character/wizard/StepReview.vue'
import { useCharacterWizardStore } from '~/stores/characterWizard'

// Mock data for useCharacterSheet
const mockCharacter = ref({
  id: 123,
  public_id: 'shadow-rogue-x7k3',
  name: 'Elara Moonwhisper',
  race: { id: 1, name: 'Elf', slug: 'elf' },
  classes: [{ class: { id: 2, name: 'Rogue', slug: 'rogue' }, level: 1 }],
  background: { id: 3, name: 'Criminal', slug: 'criminal' },
  alignment: 'Chaotic Good',
  speed: 30,
  proficiency_bonus: 2,
  is_complete: false,
  has_inspiration: false,
  death_save_successes: 0,
  death_save_failures: 0,
  portrait: null,
  conditions: []
})

const mockStats = ref({
  hit_points: { current: 12, max: 12, temporary: 0 },
  armor_class: 14,
  initiative_bonus: 2,
  proficiency_bonus: 2,
  passive_perception: 12,
  passive_investigation: 10,
  passive_insight: 12,
  ability_scores: {
    STR: { score: 12, modifier: 1 },
    DEX: { score: 18, modifier: 4 },
    CON: { score: 13, modifier: 1 },
    INT: { score: 10, modifier: 0 },
    WIS: { score: 14, modifier: 2 },
    CHA: { score: 16, modifier: 3 }
  },
  saving_throws: {
    STR: 1,
    DEX: 6, // proficient
    CON: 1,
    INT: 2, // proficient
    WIS: 2,
    CHA: 3
  },
  spellcasting: null,
  hit_dice: [{ die: 'd8', total: 1, used: 0 }],
  carrying_capacity: 180,
  push_drag_lift: 360
})

const mockProficiencies = ref([
  { id: 1, name: 'Stealth', type: 'skill', skill: { slug: 'stealth' }, expertise: true },
  { id: 2, name: 'Thieves\' Tools', type: 'tool', tool: { slug: 'thieves-tools' } }
])

const mockFeatures = ref([
  { id: 1, name: 'Sneak Attack', description: '1d6 extra damage', level: 1 }
])

const mockEquipment = ref([
  { id: 1, item: { name: 'Rapier' }, quantity: 1 },
  { id: 2, item: { name: 'Leather Armor' }, quantity: 1 }
])

const mockSpells = ref([])

const mockLanguages = ref([
  { id: 1, language: { name: 'Common' } },
  { id: 2, language: { name: 'Elvish' } }
])

const mockSkills = ref([
  { id: 1, name: 'Stealth', slug: 'stealth', ability_code: 'DEX', modifier: 8, proficient: true, expertise: true },
  { id: 2, name: 'Perception', slug: 'perception', ability_code: 'WIS', modifier: 2, proficient: false, expertise: false }
])

const mockSavingThrows = ref([
  { ability: 'STR', modifier: 1, proficient: false },
  { ability: 'DEX', modifier: 6, proficient: true },
  { ability: 'CON', modifier: 1, proficient: false },
  { ability: 'INT', modifier: 2, proficient: true },
  { ability: 'WIS', modifier: 2, proficient: false },
  { ability: 'CHA', modifier: 3, proficient: false }
])

const mockHitDice = ref([
  { die: 'd8', total: 1, current: 1 }
])

// Mock useCharacterSheet composable
vi.mock('~/composables/useCharacterSheet', () => ({
  useCharacterSheet: vi.fn(() => ({
    character: mockCharacter,
    stats: mockStats,
    proficiencies: mockProficiencies,
    features: mockFeatures,
    equipment: mockEquipment,
    spells: mockSpells,
    languages: mockLanguages,
    skills: mockSkills,
    savingThrows: mockSavingThrows,
    hitDice: mockHitDice,
    notes: ref({}),
    loading: ref(false),
    error: ref(null),
    refresh: vi.fn()
  }))
}))

// Stub sheet components - render meaningful content for tests
const stubs = {
  CharacterSheetHeader: {
    template: `<div data-testid="sheet-header">
      <h1>{{ character.name }}</h1>
      <p>{{ character.race?.name }} · {{ character.classes?.[0]?.class?.name }} · {{ character.background?.name }}</p>
    </div>`,
    props: ['character']
  },
  CharacterSheetAbilityScoreBlock: {
    template: `<div data-testid="ability-scores">
      <div v-for="(data, code) in stats.ability_scores" :key="code">
        {{ code }}: {{ data.score }} ({{ data.modifier >= 0 ? '+' : '' }}{{ data.modifier }})
      </div>
    </div>`,
    props: ['stats']
  },
  CharacterSheetCombatStatsGrid: {
    template: `<div data-testid="combat-stats">
      <span>HP: {{ stats.hit_points?.max }}</span>
      <span>AC: {{ stats.armor_class }}</span>
      <span>Speed: {{ character.speed }}</span>
    </div>`,
    props: ['character', 'stats']
  },
  CharacterSheetSavingThrowsList: {
    template: `<div data-testid="saving-throws">
      <div v-for="save in savingThrows" :key="save.ability">
        {{ save.ability }}: {{ save.modifier >= 0 ? '+' : '' }}{{ save.modifier }}
        <span v-if="save.proficient">●</span>
      </div>
    </div>`,
    props: ['savingThrows']
  },
  CharacterSheetSkillsList: {
    template: `<div data-testid="skills-list">
      <div v-for="skill in skills" :key="skill.slug">
        {{ skill.name }}: {{ skill.modifier >= 0 ? '+' : '' }}{{ skill.modifier }}
      </div>
    </div>`,
    props: ['skills']
  },
  CharacterSheetProficienciesPanel: {
    template: '<div data-testid="proficiencies"><span>Proficiencies</span></div>',
    props: ['proficiencies']
  },
  CharacterSheetLanguagesPanel: {
    template: '<div data-testid="languages"><span>Languages</span></div>',
    props: ['languages']
  },
  CharacterSheetEquipmentPanel: {
    template: '<div data-testid="equipment"><span>Equipment</span></div>',
    props: ['equipment', 'carryingCapacity', 'pushDragLift']
  },
  CharacterSheetSpellsPanel: {
    template: '<div data-testid="spells"><span>Spells</span></div>',
    props: ['spells', 'stats']
  },
  CharacterSheetFeaturesPanel: {
    template: '<div data-testid="features"><span>Features</span></div>',
    props: ['features']
  },
  CharacterSheetPassiveScores: {
    template: '<div data-testid="passive-scores"><span>Passive</span></div>',
    props: ['perception', 'investigation', 'insight']
  },
  CharacterSheetHitDice: {
    template: '<div data-testid="hit-dice"><span>Hit Dice</span></div>',
    props: ['hitDice']
  },
  CharacterSheetDeathSaves: {
    template: '<div data-testid="death-saves"><span>Death Saves</span></div>',
    props: ['successes', 'failures']
  }
}

describe('StepReview', () => {
  let pinia: ReturnType<typeof createPinia>
  let store: ReturnType<typeof useCharacterWizardStore>

  // Setup store data function
  const setupStoreData = () => {
    store.characterId = 123
    store.publicId = 'shadow-rogue-x7k3'
    store.selections.name = 'Elara Moonwhisper'
    store.selections.race = {
      id: 1,
      name: 'Elf',
      slug: 'elf',
      speed: 30,
      source: { code: 'PHB', name: 'Player\'s Handbook' }
    } as any
    store.selections.class = {
      id: 2,
      name: 'Rogue',
      slug: 'rogue',
      source: { code: 'PHB', name: 'Player\'s Handbook' }
    } as any
    store.selections.background = {
      id: 3,
      name: 'Criminal',
      slug: 'criminal',
      source: { code: 'PHB', name: 'Player\'s Handbook' }
    } as any
    store.selections.alignment = 'CG'
  }

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    store = useCharacterWizardStore()
    setupStoreData()

    // Reset mock data to defaults
    mockStats.value.spellcasting = null
    mockSpells.value = []
  })

  describe('structure', () => {
    it('renders character name from useCharacterSheet', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.text()).toContain('Elara Moonwhisper')
    })

    it('renders race/class/background summary', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.text()).toContain('Elf')
      expect(wrapper.text()).toContain('Rogue')
      expect(wrapper.text()).toContain('Criminal')
    })

    it('renders sheet header component', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.find('[data-testid="sheet-header"]').exists()).toBe(true)
    })

    it('renders combat stats grid', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.find('[data-testid="combat-stats"]').exists()).toBe(true)
    })

    it('renders saving throws list', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.find('[data-testid="saving-throws"]').exists()).toBe(true)
    })

    it('renders ability scores section', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.find('[data-testid="ability-scores"]').exists()).toBe(true)
    })

    it('renders skills list', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.find('[data-testid="skills-list"]').exists()).toBe(true)
    })
  })

  describe('combat stats integration', () => {
    it('displays hit points from stats', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.text()).toContain('HP: 12')
    })

    it('displays armor class from stats', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.text()).toContain('AC: 14')
    })

    it('displays speed from character', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.text()).toContain('Speed: 30')
    })
  })

  describe('ability scores display', () => {
    it('displays all six ability scores', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      const text = wrapper.text()
      expect(text).toContain('STR')
      expect(text).toContain('DEX')
      expect(text).toContain('CON')
      expect(text).toContain('INT')
      expect(text).toContain('WIS')
      expect(text).toContain('CHA')
    })

    it('displays ability score values', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      // Check for some score values
      expect(wrapper.text()).toContain('12')
      expect(wrapper.text()).toContain('18')
    })
  })

  describe('saving throws display', () => {
    it('displays saving throw modifiers', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      // DEX save should be +6 (proficient)
      expect(wrapper.text()).toContain('+6')
    })
  })

  describe('spellcasting conditional rendering', () => {
    it('hides spells panel for non-spellcasters', async () => {
      mockStats.value.spellcasting = null

      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.find('[data-testid="spells"]').exists()).toBe(false)
    })

    it('shows spells panel when character is spellcaster', async () => {
      mockStats.value.spellcasting = {
        ability: 'INT',
        ability_modifier: 3,
        spell_save_dc: 13,
        spell_attack_bonus: 5
      }

      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.find('[data-testid="spells"]').exists()).toBe(true)
    })
  })

  describe('proficiencies section', () => {
    it('renders proficiencies panel', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.find('[data-testid="proficiencies"]').exists()).toBe(true)
    })
  })

  describe('languages section', () => {
    it('renders languages panel', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.find('[data-testid="languages"]').exists()).toBe(true)
    })
  })

  describe('equipment section', () => {
    it('renders equipment panel', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.find('[data-testid="equipment"]').exists()).toBe(true)
    })
  })

  describe('features section', () => {
    it('renders features panel', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.find('[data-testid="features"]').exists()).toBe(true)
    })
  })

  describe('finish button', () => {
    it('shows Create Character button', async () => {
      const wrapper = await mountSuspended(StepReview, {
        global: { stubs, plugins: [pinia] }
      })

      expect(wrapper.find('[data-testid="finish-btn"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Create Character')
    })
  })
})
