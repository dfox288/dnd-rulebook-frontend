<!-- app/components/character/ImportModal.vue -->
<script setup lang="ts">
/**
 * Character Import Modal
 *
 * Modal for importing a character from JSON.
 * Supports two input methods:
 * - File upload (.json files)
 * - Paste JSON directly
 *
 * Validates structure before emitting import event.
 */

/** Expected structure of import data */
interface ImportData {
  format_version: string
  character: {
    public_id: string
    name: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'import': [data: ImportData]
}>()

/** Active tab: 'upload' or 'paste' */
const activeTab = ref('upload')

/** Selected file from file input */
const selectedFile = ref<File | null>(null)

/** Pasted JSON text */
const pastedJson = ref('')

/** Validation error message */
const error = ref<string | null>(null)

/** Successfully parsed data ready for import */
const parsedData = ref<ImportData | null>(null)

/** Tab items for UTabs */
const tabItems = [
  { label: 'Upload File', slot: 'upload', icon: 'i-heroicons-arrow-up-tray' },
  { label: 'Paste JSON', slot: 'paste', icon: 'i-heroicons-clipboard-document' }
]

/**
 * Whether the Import button should be enabled
 * Requires valid parsed data with no errors
 */
const canImport = computed(() => {
  return parsedData.value !== null && error.value === null
})

/**
 * Handle file selection from input
 */
async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    selectedFile.value = null
    parsedData.value = null
    return
  }

  selectedFile.value = file

  try {
    const text = await file.text()
    parseAndValidate(text)
  } catch {
    error.value = 'Failed to read file'
    parsedData.value = null
  }
}

/**
 * Validate and parse JSON string
 * Called when pasting JSON or after file read
 */
function validateAndParse() {
  if (!pastedJson.value.trim()) {
    error.value = null
    parsedData.value = null
    return
  }
  parseAndValidate(pastedJson.value)
}

/**
 * Parse JSON and validate structure
 */
function parseAndValidate(jsonString: string) {
  error.value = null
  parsedData.value = null

  // Try to parse JSON
  let data: unknown
  try {
    data = JSON.parse(jsonString)
  } catch {
    error.value = 'Invalid JSON format'
    return
  }

  // Validate structure
  if (typeof data !== 'object' || data === null) {
    error.value = 'Invalid JSON format'
    return
  }

  const obj = data as Record<string, unknown>

  if (!obj.format_version) {
    error.value = 'Missing format version'
    return
  }

  if (!obj.character) {
    error.value = 'Missing character data'
    return
  }

  // Valid!
  parsedData.value = obj as ImportData
}

/**
 * Handle Import button click
 */
function handleImport() {
  if (!parsedData.value) return

  emit('import', parsedData.value)
  emit('update:open', false)
}

/**
 * Handle Cancel button click
 */
function handleCancel() {
  emit('update:open', false)
}

/**
 * Reset state when modal opens
 */
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    activeTab.value = 'upload'
    selectedFile.value = null
    pastedJson.value = ''
    error.value = null
    parsedData.value = null
  }
})

/**
 * Watch pasted JSON for changes and validate
 */
watch(pastedJson, () => {
  if (activeTab.value === 'paste') {
    validateAndParse()
  }
})
</script>

<template>
  <UModal
    :open="open"
    @update:open="emit('update:open', $event)"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Import Character
        </h3>
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <!-- Tabs -->
        <UTabs
          v-model="activeTab"
          :items="tabItems"
          class="w-full"
        >
          <!-- Upload File Tab -->
          <template #upload>
            <div class="pt-4 space-y-4">
              <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <UIcon
                  name="i-heroicons-document-arrow-up"
                  class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3"
                />
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Select a character JSON file
                </p>
                <input
                  data-testid="file-input"
                  type="file"
                  accept=".json"
                  class="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-50 file:text-primary-700
                    dark:file:bg-primary-900 dark:file:text-primary-300
                    hover:file:bg-primary-100 dark:hover:file:bg-primary-800
                    cursor-pointer"
                  @change="handleFileSelect"
                >
              </div>

              <!-- Selected file info -->
              <div
                v-if="selectedFile"
                class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <UIcon
                  name="i-heroicons-document-check"
                  class="w-5 h-5 text-green-500"
                />
                <span>{{ selectedFile.name }}</span>
              </div>
            </div>
          </template>

          <!-- Paste JSON Tab -->
          <template #paste>
            <div class="pt-4">
              <UTextarea
                v-model="pastedJson"
                data-testid="json-input"
                placeholder="Paste character JSON here..."
                :rows="10"
                class="font-mono text-sm"
              />
            </div>
          </template>
        </UTabs>

        <!-- Error message -->
        <UAlert
          v-if="error"
          color="error"
          icon="i-heroicons-exclamation-triangle"
          :title="error"
        />

        <!-- Success preview -->
        <div
          v-if="parsedData && !error"
          class="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
        >
          <UIcon
            name="i-heroicons-check-circle"
            class="w-5 h-5"
          />
          <span>Ready to import: <strong>{{ parsedData.character.name }}</strong></span>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          data-testid="cancel-btn"
          color="neutral"
          variant="ghost"
          @click="handleCancel"
        >
          Cancel
        </UButton>
        <UButton
          data-testid="import-btn"
          color="primary"
          :disabled="!canImport"
          @click="handleImport"
        >
          Import
        </UButton>
      </div>
    </template>
  </UModal>
</template>
