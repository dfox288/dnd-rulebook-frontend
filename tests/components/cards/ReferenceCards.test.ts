import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'

// Import all 10 reference card components
import AbilityScoreCard from '~/components/ability-score/AbilityScoreCard.vue'
import ConditionCard from '~/components/condition/ConditionCard.vue'
import DamageTypeCard from '~/components/damage-type/DamageTypeCard.vue'
import ItemTypeCard from '~/components/item-type/ItemTypeCard.vue'
import LanguageCard from '~/components/language/LanguageCard.vue'
import ProficiencyTypeCard from '~/components/proficiency-type/ProficiencyTypeCard.vue'
import SizeCard from '~/components/size/SizeCard.vue'
import SkillCard from '~/components/skill/SkillCard.vue'
import SourceCard from '~/components/source/SourceCard.vue'
import SpellSchoolCard from '~/components/spell-school/SpellSchoolCard.vue'

const referenceCards = [
  {
    name: 'AbilityScoreCard',
    component: AbilityScoreCard,
    propName: 'abilityScore',
    mockData: { id: 1, code: 'STR', name: 'Strength' },
    displayField: 'name',
    categoryBadgeText: 'Ability Score',
    imageFolder: 'ability_scores',
    imageKey: 'str'
  },
  {
    name: 'ConditionCard',
    component: ConditionCard,
    propName: 'condition',
    mockData: { id: 1, name: 'Blinded', slug: 'blinded', description: 'A blinded creature can\'t see.' },
    displayField: 'name',
    categoryBadgeText: 'Condition',
    imageFolder: 'conditions',
    imageKey: 'blinded'
  },
  {
    name: 'DamageTypeCard',
    component: DamageTypeCard,
    propName: 'damageType',
    mockData: { id: 1, name: 'Fire' },
    displayField: 'name',
    categoryBadgeText: 'Damage Type',
    imageFolder: 'damage_types',
    imageKey: 'fire'
  },
  {
    name: 'ItemTypeCard',
    component: ItemTypeCard,
    propName: 'itemType',
    mockData: { id: 1, code: 'A', name: 'Ammunition', description: 'Arrows, bolts, and projectiles' },
    displayField: 'name',
    categoryBadgeText: 'Item Type',
    imageFolder: 'item_types',
    imageKey: 'a'
  },
  {
    name: 'LanguageCard',
    component: LanguageCard,
    propName: 'language',
    mockData: { id: 1, name: 'Elvish', slug: 'elvish', script: 'Elvish', typical_speakers: 'Elves', description: 'Fluid and melodic language.' },
    displayField: 'name',
    categoryBadgeText: null, // No category badge on LanguageCard
    imageFolder: 'languages',
    imageKey: 'elvish'
  },
  {
    name: 'ProficiencyTypeCard',
    component: ProficiencyTypeCard,
    propName: 'proficiencyType',
    mockData: { id: 1, name: 'Light Armor', slug: 'light-armor', category: 'armor', subcategory: 'light' },
    displayField: 'name',
    categoryBadgeText: 'Proficiency Type',
    imageFolder: 'proficiency_types',
    imageKey: 'light-armor'
  },
  {
    name: 'SizeCard',
    component: SizeCard,
    propName: 'size',
    mockData: { id: 1, code: 'M', name: 'Medium' },
    displayField: 'name',
    categoryBadgeText: 'Creature Size',
    imageFolder: 'sizes',
    imageKey: 'm'
  },
  {
    name: 'SkillCard',
    component: SkillCard,
    propName: 'skill',
    mockData: { id: 1, name: 'Acrobatics', slug: 'acrobatics', ability_score: { id: 2, code: 'DEX', name: 'Dexterity' } },
    displayField: 'name',
    categoryBadgeText: 'Skill',
    imageFolder: 'skills',
    imageKey: 'acrobatics'
  },
  {
    name: 'SourceCard',
    component: SourceCard,
    propName: 'source',
    mockData: { id: 1, code: 'PHB', name: 'Player\'s Handbook', publisher: 'Wizards of the Coast', publication_year: 2014, edition: '5e' },
    displayField: 'name',
    categoryBadgeText: null, // No category badge on SourceCard
    imageFolder: 'sources',
    imageKey: 'phb'
  },
  {
    name: 'SpellSchoolCard',
    component: SpellSchoolCard,
    propName: 'spellSchool',
    mockData: { id: 1, code: 'A', name: 'Abjuration', description: 'Abjuration spells are protective.' },
    displayField: 'name',
    categoryBadgeText: 'Spell School',
    imageFolder: 'spell_schools',
    imageKey: 'A'
  }
]

describe('Reference Entity Cards - Shared Behavior', () => {
  describe.each(referenceCards)('$name', ({ component, propName, mockData, displayField, categoryBadgeText, imageFolder, imageKey }) => {
    it('renders entity name', async () => {
      const wrapper = await mountSuspended(component, {
        props: { [propName]: mockData }
      })
      expect(wrapper.text()).toContain(mockData[displayField] || mockData.name)
    })

    it('displays category badge', async () => {
      if (!categoryBadgeText) {
        // Skip test for cards without category badges
        return
      }
      const wrapper = await mountSuspended(component, {
        props: { [propName]: mockData }
      })
      expect(wrapper.text()).toContain(categoryBadgeText)
    })

    it('handles minimal data gracefully', async () => {
      const wrapper = await mountSuspended(component, {
        props: { [propName]: mockData }
      })
      // Should render without throwing errors
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain(mockData[displayField] || mockData.name)
    })

    it('computes background image URL correctly', async () => {
      const wrapper = await mountSuspended(component, {
        props: { [propName]: mockData }
      })

      const url = wrapper.vm.backgroundImageUrl
      expect(url).toBe(`/images/generated/conversions/256/${imageFolder}/stability-ai/${imageKey}.webp`)
    })
  })
})
