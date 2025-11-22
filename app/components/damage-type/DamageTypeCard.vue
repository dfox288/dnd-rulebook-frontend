<script setup lang="ts">
interface DamageType {
  id: number
  name: string
}

interface Props {
  damageType: DamageType
}

const props = defineProps<Props>()
const { getImagePath } = useEntityImage()

// Use lowercased name as slug (e.g., Fire -> fire)
const slug = computed(() => props.damageType.name.toLowerCase())
const backgroundImageUrl = computed(() =>
  getImagePath('damage-types', slug.value, 256)
)
</script>

<template>
  <UCard class="relative overflow-hidden hover:shadow-lg transition-shadow h-full border border-gray-200 dark:border-gray-700 group">
    <!-- Background Image Layer -->
    <div
      v-if="backgroundImageUrl"
      class="absolute inset-0 bg-cover bg-center opacity-10 transition-opacity duration-300 group-hover:opacity-20"
      :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
    />

    <!-- Content Layer -->
    <div class="relative z-10 space-y-3">
      <!-- Damage Type Name -->
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {{ damageType.name }}
      </h3>

      <!-- Type Badge -->
      <div class="flex items-center gap-2">
        <UBadge
          color="neutral"
          variant="soft"
          size="sm"
        >
          Damage Type
        </UBadge>
      </div>
    </div>
  </UCard>
</template>
