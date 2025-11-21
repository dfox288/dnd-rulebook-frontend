<script setup lang="ts">
interface DamageType {
  id: number
  name: string
}

interface Props {
  damageType: DamageType
}

defineProps<Props>()
</script>

<template>
  <UCard class="hover:shadow-lg transition-shadow h-full border border-gray-200 dark:border-gray-700">
    <div class="space-y-3">
      <!-- Damage Type Name -->
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {{ damageType.name }}
      </h3>

      <!-- Type Badge -->
      <div class="flex items-center gap-2">
        <UBadge color="neutral" variant="soft" size="sm">
          Damage Type
        </UBadge>
      </div>
    </div>
  </UCard>
</template>
