export interface SkillOption {
  type: 'skill'
  skill_id: number
  skill: {
    id: number
    name: string
    slug: string
  }
}

export interface ProficiencyTypeOption {
  type: 'proficiency_type'
  proficiency_type_id: number
  proficiency_type: {
    id: number
    name: string
    slug: string
  }
}

export type ProficiencyOption = SkillOption | ProficiencyTypeOption

export interface ProficiencyChoice {
  quantity: number
  remaining: number
  /** IDs of skills already selected for this choice group */
  selected_skills: number[]
  /** IDs of proficiency types already selected for this choice group */
  selected_proficiency_types: number[]
  /** All available options (no longer filtered by selection) */
  options: ProficiencyOption[]
}

export interface ProficiencyChoicesResponse {
  data: {
    class: Record<string, ProficiencyChoice>
    race: Record<string, ProficiencyChoice>
    background: Record<string, ProficiencyChoice>
  }
}

export interface CharacterProficiency {
  id: number
  source: 'class' | 'race' | 'background'
  type: 'skill' | 'saving_throw' | 'armor' | 'weapon' | 'tool' | 'language'
  name: string
  ability_score?: {
    id: number
    name: string
    code: string
  }
}

export interface CharacterFeature {
  id: number
  source: 'class' | 'race' | 'background'
  name: string
  description: string
  level?: number
}

export interface ProficienciesResponse {
  data: CharacterProficiency[]
}

export interface FeaturesResponse {
  data: CharacterFeature[]
}
