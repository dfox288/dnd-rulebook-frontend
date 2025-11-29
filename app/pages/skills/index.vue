<script setup lang="ts">
import { computed } from 'vue'
import type { Skill } from '~/types'

const {
  searchQuery,
  data,
  totalResults,
  loading,
  error,
  refresh,
  clearFilters,
  hasActiveFilters
} = useEntityList({
  endpoint: '/skills',
  cacheKey: 'skills-list',
  queryBuilder: computed(() => ({})),
  noPagination: true,
  seo: {
    title: 'Skills - D&D 5e Compendium',
    description: 'Browse all D&D 5e skills including Acrobatics, Athletics, Stealth, Perception, and more.'
  }
})

const skills = computed(() => data.value as Skill[])
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Breadcrumb -->
    <UiDetailBreadcrumb
      list-path="/skills"
      list-label="Skills"
      class="mb-6"
    />

    <UiListPageHeader
      title="Skills"
      :total="totalResults"
      description="Browse D&D 5e skills"
      :loading="loading"
      :has-active-filters="hasActiveFilters"
    />

    <div class="mb-6">
      <UInput
        v-model="searchQuery"
        placeholder="Search skills..."
      >
        <template
          v-if="searchQuery"
          #trailing
        >
          <UButton
            color="neutral"
            variant="link"
            :padded="false"
            @click="searchQuery = ''"
          />
        </template>
      </UInput>
    </div>

    <UiListStates
      :loading="loading"
      :error="error"
      :empty="skills.length === 0"
      :meta="{ from: 1, to: totalResults, total: totalResults, current_page: 1, last_page: 1, per_page: totalResults }"
      :total="totalResults"
      entity-name="skill"
      entity-name-plural="Skills"
      :has-filters="hasActiveFilters"
      :current-page="1"
      :per-page="totalResults"
      @retry="refresh"
      @clear-filters="clearFilters"
    >
      <template #grid>
        <SkillCard
          v-for="skill in skills"
          :key="skill.id"
          :skill="skill"
        />
      </template>
    </UiListStates>

    <UiBackLink />
    <JsonDebugPanel
      :data="{ skills, total: totalResults }"
      title="Skills Data"
    />
  </div>
</template>
