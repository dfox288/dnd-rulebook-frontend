<script setup lang="ts">
const { apiBase } = useApi()
const route = useRoute()
const slug = route.params.slug as string

// Fetch item data using useAsyncData for SSR support
const { data: item, error, pending } = await useAsyncData(
  `item-${slug}`,
  async () => {
    
    const response = await $fetch(`${apiBase}/items/${slug}`)
    return response.data
  }
)

// Set page meta
useSeoMeta({
  title: computed(() => item.value ? `${item.value.name} - D&D 5e Item` : 'Item - D&D 5e Compendium'),
  description: computed(() => item.value?.description?.substring(0, 160)),
})

/**
 * Format cost in gold pieces
 */
const costInGold = computed(() => {
  if (!item.value?.cost_cp) return null
  const gp = item.value.cost_cp / 100
  return gp >= 1 ? `${gp} gp` : `${item.value.cost_cp} cp`
})

/**
 * Get rarity color for badge
 */
const rarityColor = computed(() => {
  if (!item.value) return 'gray'
  const colors: Record<string, string> = {
    common: 'gray',
    uncommon: 'green',
    rare: 'blue',
    'very rare': 'purple',
    legendary: 'amber',
    artifact: 'red'
  }
  return colors[item.value.rarity.toLowerCase()] || 'gray'
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center py-12">
      <div class="flex flex-col items-center gap-4">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
        <p class="text-gray-600 dark:text-gray-400">Loading item...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-12">
      <UCard>
        <div class="text-center">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Item Not Found
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <UButton to="/search" color="primary">
            Back to Search
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Item Content -->
    <div v-else-if="item" class="space-y-6">
      <!-- Header -->
      <div>
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <UBadge color="amber" variant="subtle">
            {{ item.item_type.name }}
          </UBadge>
          <UBadge :color="rarityColor" variant="soft">
            {{ item.rarity }}
          </UBadge>
          <UBadge v-if="item.is_magic" color="purple" variant="soft" size="xs">
            Magic
          </UBadge>
          <UBadge v-if="item.requires_attunement" color="blue" variant="soft" size="xs">
            Requires Attunement
          </UBadge>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">
          {{ item.name }}
        </h1>
      </div>

      <!-- Quick Stats -->
      <UCard>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Cost -->
          <div v-if="costInGold">
            <div class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Cost
            </div>
            <div class="text-gray-900 dark:text-gray-100">
              {{ costInGold }}
            </div>
          </div>

          <!-- Weight -->
          <div v-if="item.weight">
            <div class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Weight
            </div>
            <div class="text-gray-900 dark:text-gray-100">
              {{ item.weight }} lb
            </div>
          </div>

          <!-- Damage (for weapons) -->
          <div v-if="item.damage_dice">
            <div class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Damage
            </div>
            <div class="text-gray-900 dark:text-gray-100">
              {{ item.damage_dice }}
              <span v-if="item.damage_type" class="text-gray-600 dark:text-gray-400">
                {{ item.damage_type.name }}
              </span>
            </div>
            <div v-if="item.versatile_damage" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Versatile: {{ item.versatile_damage }}
            </div>
          </div>

          <!-- Armor Class (for armor) -->
          <div v-if="item.armor_class !== null">
            <div class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Armor Class
            </div>
            <div class="text-gray-900 dark:text-gray-100">
              {{ item.armor_class }}
            </div>
          </div>

          <!-- Range (for ranged weapons) -->
          <div v-if="item.range_normal">
            <div class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Range
            </div>
            <div class="text-gray-900 dark:text-gray-100">
              {{ item.range_normal }}{{ item.range_long ? `/${item.range_long}` : '' }} ft.
            </div>
          </div>

          <!-- Strength Requirement -->
          <div v-if="item.strength_requirement">
            <div class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
              Strength Required
            </div>
            <div class="text-gray-900 dark:text-gray-100">
              {{ item.strength_requirement }}
            </div>
          </div>
        </div>
      </UCard>

      <!-- Properties -->
      <UCard v-if="item.properties && item.properties.length > 0">
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Properties
          </h2>
        </template>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="property in item.properties"
            :key="property.id"
            color="gray"
            variant="soft"
          >
            {{ property.name }}
          </UBadge>
        </div>
        <div class="mt-4 space-y-2">
          <div
            v-for="property in item.properties"
            :key="`desc-${property.id}`"
            class="text-sm"
          >
            <span class="font-medium text-gray-900 dark:text-gray-100">{{ property.name }}:</span>
            <span class="text-gray-600 dark:text-gray-400 ml-1">{{ property.description }}</span>
          </div>
        </div>
      </UCard>

      <!-- Description -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Description
          </h2>
        </template>
        <div class="prose dark:prose-invert max-w-none">
          <p class="whitespace-pre-line text-gray-700 dark:text-gray-300">{{ item.description }}</p>
        </div>
      </UCard>

      <!-- Modifiers (for magic items) -->
      <UCard v-if="item.modifiers && item.modifiers.length > 0">
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Modifiers
          </h2>
        </template>
        <div class="space-y-3">
          <div
            v-for="modifier in item.modifiers"
            :key="modifier.id"
            class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <div class="font-medium text-gray-900 dark:text-gray-100">
              {{ modifier.modifier_type }}: {{ modifier.value > 0 ? '+' : '' }}{{ modifier.value }}
            </div>
            <div v-if="modifier.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ modifier.description }}
            </div>
          </div>
        </div>
      </UCard>

      <!-- Abilities (for magic items) -->
      <UCard v-if="item.abilities && item.abilities.length > 0">
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Abilities
          </h2>
        </template>
        <div class="space-y-4">
          <div
            v-for="ability in item.abilities"
            :key="ability.id"
            class="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20"
          >
            <div class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {{ ability.name }}
            </div>
            <div class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {{ ability.description }}
            </div>
          </div>
        </div>
      </UCard>

      <!-- Sources -->
      <UCard v-if="item.sources && item.sources.length > 0">
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Source
          </h2>
        </template>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="source in item.sources"
            :key="source.code"
            class="flex items-center gap-2"
          >
            <UBadge color="gray" variant="soft">
              {{ source.name }}
            </UBadge>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              p. {{ source.pages }}
            </span>
          </div>
        </div>
      </UCard>

      <!-- Back Button -->
      <div class="flex justify-center pt-4">
        <UButton
          to="/search"
          variant="soft"
          color="gray"
          icon="i-heroicons-arrow-left"
        >
          Back to Search
        </UButton>
      </div>
    </div>
  </div>
</template>
