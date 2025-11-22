<script setup lang="ts">
useHead({
  title: 'Typography Demo - Crimson Pro',
  meta: [
    {
      name: 'description',
      content: 'Typography demonstration page showcasing Crimson Pro font family'
    }
  ]
})

const colorMode = useColorMode()

// Sample spell data for real-world demo
const sampleSpell = {
  name: 'Fireball',
  level: 3,
  school: 'Evocation',
  description: 'A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.'
}
</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-5xl">
    <!-- Header with Color Mode Toggle -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <UiBackLink to="/" label="Back to Home" />
      </div>
      <UButton
        :icon="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
        color="neutral"
        variant="ghost"
        @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
      >
        {{ colorMode.value === 'dark' ? 'Light' : 'Dark' }} Mode
      </UButton>
    </div>

    <!-- Hero Section -->
    <div class="mb-16 text-center">
      <h1 class="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Typography Demo
      </h1>
      <h2 class="text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
        Crimson Pro — Modern Classicism
      </h2>
      <p class="text-xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
        A contemporary serif typeface designed for digital reading. Elegant without being decorative,
        sophisticated without fantasy overkill. Perfect for a D&D reference compendium.
      </p>
    </div>

    <!-- Headings Hierarchy -->
    <section class="mb-16">
      <h2 class="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8 border-b border-gray-200 dark:border-gray-800 pb-3">
        Headings Hierarchy
      </h2>

      <div class="space-y-6">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-2 font-mono">h1 - text-5xl font-bold</p>
          <h1 class="text-5xl font-bold text-gray-900 dark:text-gray-100">
            The Fellowship of the Ring
          </h1>
        </div>

        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-2 font-mono">h2 - text-4xl font-semibold</p>
          <h2 class="text-4xl font-semibold text-gray-900 dark:text-gray-100">
            Chapter One: A Long-Expected Party
          </h2>
        </div>

        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-2 font-mono">h3 - text-3xl font-semibold</p>
          <h3 class="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            The Shire in Spring
          </h3>
        </div>

        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-2 font-mono">h4 - text-2xl font-semibold</p>
          <h4 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Bag End at Evening
          </h4>
        </div>

        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-2 font-mono">h5 - text-xl font-semibold</p>
          <h5 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            A Visitor Arrives
          </h5>
        </div>

        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-2 font-mono">h6 - text-lg font-semibold</p>
          <h6 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            The Unexpected Journey Begins
          </h6>
        </div>
      </div>
    </section>

    <!-- Body Text Samples -->
    <section class="mb-16">
      <h2 class="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8 border-b border-gray-200 dark:border-gray-800 pb-3">
        Body Text
      </h2>

      <div class="space-y-8">
        <!-- Regular Paragraph -->
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-3 font-mono">Regular paragraph - text-base leading-relaxed (1.7)</p>
          <p class="text-base leading-relaxed text-gray-700 dark:text-gray-300">
            In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends
            of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to
            eat: it was a hobbit-hole, and that means comfort. It had a perfectly round door like a porthole,
            painted green, with a shiny yellow brass knob in the exact middle.
          </p>
        </div>

        <!-- Large Paragraph -->
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-3 font-mono">Large paragraph - text-lg leading-relaxed</p>
          <p class="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            The Road goes ever on and on, down from the door where it began. Now far ahead the Road has gone,
            and I must follow, if I can, pursuing it with eager feet, until it joins some larger way
            where many paths and errands meet. And whither then? I cannot say.
          </p>
        </div>

        <!-- Small Text -->
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-3 font-mono">Small text - text-sm</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            This is smaller text, typically used for captions, metadata, or secondary information.
            Notice how Crimson Pro remains readable even at reduced sizes thanks to its high x-height.
          </p>
        </div>

        <!-- Text with Emphasis -->
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-3 font-mono">Text with emphasis</p>
          <p class="text-base leading-relaxed text-gray-700 dark:text-gray-300">
            Here is <strong class="font-bold">bold text</strong> for emphasis,
            and <em class="italic">italic text</em> for subtle distinction.
            You can also combine them: <strong class="font-bold italic">bold italic</strong>.
          </p>
        </div>

        <!-- Links -->
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-3 font-mono">Links</p>
          <p class="text-base leading-relaxed text-gray-700 dark:text-gray-300">
            This paragraph contains <a href="#" class="text-primary-600 dark:text-primary-400 hover:underline">a regular link</a> and
            <a href="#" class="text-primary-600 dark:text-primary-400 hover:underline font-semibold">a semibold link</a> for comparison.
          </p>
        </div>

        <!-- Lists -->
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-3 font-mono">Bulleted list</p>
          <ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Strength governs physical power and melee attacks</li>
            <li>Dexterity affects agility, armor class, and ranged attacks</li>
            <li>Constitution determines hit points and stamina</li>
            <li>Intelligence influences spellcasting for wizards</li>
          </ul>
        </div>

        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-3 font-mono">Numbered list</p>
          <ol class="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Roll for initiative at the start of combat</li>
            <li>Take your turn: move and take an action</li>
            <li>Resolve attacks and saving throws</li>
            <li>End turn and begin next round</li>
          </ol>
        </div>
      </div>
    </section>

    <!-- UI Components -->
    <section class="mb-16">
      <h2 class="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8 border-b border-gray-200 dark:border-gray-800 pb-3">
        UI Components
      </h2>

      <div class="space-y-8">
        <!-- Buttons -->
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-4 font-mono">Buttons</p>
          <div class="flex flex-wrap gap-3">
            <UButton color="primary">Primary Button</UButton>
            <UButton color="neutral">Neutral Button</UButton>
            <UButton color="success">Success Button</UButton>
            <UButton color="error">Error Button</UButton>
            <UButton variant="outline" color="primary">Outline Button</UButton>
            <UButton variant="ghost" color="neutral">Ghost Button</UButton>
          </div>
        </div>

        <!-- Badges -->
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-4 font-mono">Badges</p>
          <div class="flex flex-wrap gap-2">
            <UBadge color="primary" variant="solid">3rd Level</UBadge>
            <UBadge color="info" variant="solid">Evocation</UBadge>
            <UBadge color="success" variant="subtle">Common</UBadge>
            <UBadge color="warning" variant="subtle">Uncommon</UBadge>
            <UBadge color="error" variant="solid">Legendary</UBadge>
            <UBadge color="neutral" variant="outline">PHB</UBadge>
          </div>
        </div>

        <!-- Cards -->
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-4 font-mono">Card with text</p>
          <UCard class="max-w-2xl">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Wizard Class Features
            </h3>
            <p class="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
              As a wizard, you gain the following class features. You have proficiency with daggers, darts,
              slings, quarterstaffs, and light crossbows. Your spellcasting ability is Intelligence.
            </p>
            <div class="flex gap-2">
              <UBadge color="error" variant="solid">d6 Hit Die</UBadge>
              <UBadge color="primary" variant="solid">Intelligence</UBadge>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Real Content Example -->
    <section class="mb-16">
      <h2 class="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8 border-b border-gray-200 dark:border-gray-800 pb-3">
        Real Content Example
      </h2>

      <div class="max-w-2xl">
        <UCard>
          <!-- Spell Header -->
          <div class="mb-4">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {{ sampleSpell.name }}
            </h3>
            <div class="flex gap-2">
              <UBadge color="primary" variant="solid">{{ sampleSpell.level }}rd Level</UBadge>
              <UBadge color="info" variant="solid">{{ sampleSpell.school }}</UBadge>
            </div>
          </div>

          <!-- Spell Stats -->
          <div class="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div>
              <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Casting Time</p>
              <p class="text-base text-gray-900 dark:text-gray-100">1 action</p>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Range</p>
              <p class="text-base text-gray-900 dark:text-gray-100">150 feet</p>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Duration</p>
              <p class="text-base text-gray-900 dark:text-gray-100">Instantaneous</p>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-4">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Description
            </h4>
            <p class="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              {{ sampleSpell.description }}
            </p>
          </div>

          <!-- Damage -->
          <div class="mb-4">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Damage
            </h4>
            <div class="flex gap-2">
              <UBadge color="error" variant="subtle">8d6 Fire</UBadge>
              <UBadge color="neutral" variant="outline">Dexterity Save</UBadge>
            </div>
          </div>

          <!-- Source -->
          <div class="pt-3 border-t border-gray-200 dark:border-gray-800">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Source: <span class="font-semibold">Player's Handbook</span> (PHB)
            </p>
          </div>
        </UCard>
      </div>
    </section>

    <!-- Font Weights Showcase -->
    <section class="mb-16">
      <h2 class="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8 border-b border-gray-200 dark:border-gray-800 pb-3">
        Font Weights
      </h2>

      <div class="space-y-4">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-2 font-mono">font-normal (400) - Body text</p>
          <p class="text-2xl font-normal text-gray-900 dark:text-gray-100">
            The quick brown fox jumps over the lazy dog
          </p>
        </div>

        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-2 font-mono">font-semibold (600) - Headings, UI</p>
          <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            The quick brown fox jumps over the lazy dog
          </p>
        </div>

        <div>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-2 font-mono">font-bold (700) - Strong emphasis</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      </div>
    </section>

    <!-- Color Palette Showcase -->
    <section class="mb-16">
      <h2 class="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8 border-b border-gray-200 dark:border-gray-800 pb-3">
        Color Palette - Current vs Fantasy Options
      </h2>

      <div class="space-y-12">
        <!-- Current Colors -->
        <div>
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Current Palette
          </h3>
          <p class="text-base text-gray-600 dark:text-gray-400 mb-6">
            Primary: <strong>Green</strong> | Gray: <strong>Slate</strong>
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Primary Color -->
            <UCard>
              <div class="space-y-3">
                <h4 class="text-lg font-semibold">Primary (Green)</h4>
                <div class="flex gap-2">
                  <UBadge color="primary" variant="solid">Solid Badge</UBadge>
                  <UBadge color="primary" variant="subtle">Subtle Badge</UBadge>
                  <UBadge color="primary" variant="outline">Outline Badge</UBadge>
                </div>
                <UButton color="primary">Primary Button</UButton>
              </div>
            </UCard>

            <!-- Semantic Colors -->
            <UCard>
              <div class="space-y-3">
                <h4 class="text-lg font-semibold">Semantic Colors</h4>
                <div class="grid grid-cols-2 gap-2">
                  <UBadge color="success">Success</UBadge>
                  <UBadge color="error">Error</UBadge>
                  <UBadge color="warning">Warning</UBadge>
                  <UBadge color="info">Info</UBadge>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Fantasy Color Options -->
        <div>
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            🎨 Fantasy-Friendly Options
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Option 1: Mystic Purple -->
            <UCard>
              <div class="space-y-3">
                <h4 class="text-lg font-semibold text-purple-700 dark:text-purple-400">
                  ✨ Mystic Purple
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Arcane magic, wizardry, enchantments
                </p>
                <div class="flex flex-col gap-2">
                  <div class="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-semibold">
                    Primary Action
                  </div>
                  <div class="px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 rounded-md text-sm">
                    Subtle Background
                  </div>
                  <div class="px-3 py-2 border-2 border-purple-600 text-purple-600 rounded-md text-sm">
                    Outline Style
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Option 2: Royal Blue -->
            <UCard>
              <div class="space-y-3">
                <h4 class="text-lg font-semibold text-blue-700 dark:text-blue-400">
                  🔵 Royal Blue
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Noble, trustworthy, arcane knowledge
                </p>
                <div class="flex flex-col gap-2">
                  <div class="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold">
                    Primary Action
                  </div>
                  <div class="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-md text-sm">
                    Subtle Background
                  </div>
                  <div class="px-3 py-2 border-2 border-blue-600 text-blue-600 rounded-md text-sm">
                    Outline Style
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Option 3: Amber Gold -->
            <UCard>
              <div class="space-y-3">
                <h4 class="text-lg font-semibold text-amber-700 dark:text-amber-400">
                  ⚜️ Amber Gold
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Treasure, legendary items, divine
                </p>
                <div class="flex flex-col gap-2">
                  <div class="px-3 py-2 bg-amber-600 text-white rounded-md text-sm font-semibold">
                    Primary Action
                  </div>
                  <div class="px-3 py-2 bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100 rounded-md text-sm">
                    Subtle Background
                  </div>
                  <div class="px-3 py-2 border-2 border-amber-600 text-amber-600 rounded-md text-sm">
                    Outline Style
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Option 4: Crimson Red -->
            <UCard>
              <div class="space-y-3">
                <h4 class="text-lg font-semibold text-red-700 dark:text-red-400">
                  🔥 Crimson Red
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Fire, blood magic, danger, power
                </p>
                <div class="flex flex-col gap-2">
                  <div class="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-semibold">
                    Primary Action
                  </div>
                  <div class="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded-md text-sm">
                    Subtle Background
                  </div>
                  <div class="px-3 py-2 border-2 border-red-600 text-red-600 rounded-md text-sm">
                    Outline Style
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Option 5: Emerald Green (Enhanced) -->
            <UCard>
              <div class="space-y-3">
                <h4 class="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                  🌿 Emerald Green
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Nature, druids, healing, growth
                </p>
                <div class="flex flex-col gap-2">
                  <div class="px-3 py-2 bg-emerald-600 text-white rounded-md text-sm font-semibold">
                    Primary Action
                  </div>
                  <div class="px-3 py-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 rounded-md text-sm">
                    Subtle Background
                  </div>
                  <div class="px-3 py-2 border-2 border-emerald-600 text-emerald-600 rounded-md text-sm">
                    Outline Style
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Option 6: Indigo Violet -->
            <UCard>
              <div class="space-y-3">
                <h4 class="text-lg font-semibold text-indigo-700 dark:text-indigo-400">
                  🌌 Indigo Violet
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Cosmic, otherworldly, psionics
                </p>
                <div class="flex flex-col gap-2">
                  <div class="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold">
                    Primary Action
                  </div>
                  <div class="px-3 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 rounded-md text-sm">
                    Subtle Background
                  </div>
                  <div class="px-3 py-2 border-2 border-indigo-600 text-indigo-600 rounded-md text-sm">
                    Outline Style
                  </div>
                </div>
              </div>
            </UCard>
          </div>

          <div class="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p class="text-sm text-gray-700 dark:text-gray-300">
              <strong>💡 Recommendation:</strong> Choose a primary color that matches your campaign theme.
              Purple for arcane magic, Blue for classic fantasy, Amber for treasure hunting, Red for dark campaigns,
              Emerald for nature-focused, or Indigo for cosmic/psionic themes.
            </p>
          </div>
        </div>

        <!-- Proposed Custom Scheme: Amber + Emerald -->
        <div>
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            ⚜️ Proposed: Amber & Emerald Theme
          </h3>
          <p class="text-base text-gray-600 dark:text-gray-400 mb-6">
            A treasure-hunting D&D aesthetic with warm gold and vibrant nature tones
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Primary: Amber -->
            <UCard>
              <div class="space-y-3">
                <h4 class="text-base font-semibold text-amber-700 dark:text-amber-400">
                  Primary (Amber)
                </h4>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Main actions, links, emphasis
                </p>
                <div class="space-y-2">
                  <div class="px-3 py-2 bg-amber-600 text-white rounded-md text-sm font-semibold text-center">
                    Button
                  </div>
                  <div class="px-3 py-2 bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100 rounded-md text-xs text-center">
                    Badge
                  </div>
                  <div class="text-xs text-amber-600 dark:text-amber-400 text-center">
                    Link Text
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Success: Emerald -->
            <UCard>
              <div class="space-y-3">
                <h4 class="text-base font-semibold text-emerald-700 dark:text-emerald-400">
                  Success (Emerald)
                </h4>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Positive actions, confirmations
                </p>
                <div class="space-y-2">
                  <div class="px-3 py-2 bg-emerald-600 text-white rounded-md text-sm font-semibold text-center">
                    Button
                  </div>
                  <div class="px-3 py-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 rounded-md text-xs text-center">
                    Badge
                  </div>
                  <div class="text-xs text-emerald-600 dark:text-emerald-400 text-center">
                    Link Text
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Warning: Orange -->
            <UCard>
              <div class="space-y-3">
                <h4 class="text-base font-semibold text-orange-700 dark:text-orange-400">
                  Warning (Orange)
                </h4>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Caution, important notices
                </p>
                <div class="space-y-2">
                  <div class="px-3 py-2 bg-orange-600 text-white rounded-md text-sm font-semibold text-center">
                    Button
                  </div>
                  <div class="px-3 py-2 bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100 rounded-md text-xs text-center">
                    Badge
                  </div>
                  <div class="text-xs text-orange-600 dark:text-orange-400 text-center">
                    Link Text
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Error/Danger: Red -->
            <UCard>
              <div class="space-y-3">
                <h4 class="text-base font-semibold text-red-700 dark:text-red-400">
                  Error (Red)
                </h4>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Errors, destructive actions
                </p>
                <div class="space-y-2">
                  <div class="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-semibold text-center">
                    Button
                  </div>
                  <div class="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded-md text-xs text-center">
                    Badge
                  </div>
                  <div class="text-xs text-red-600 dark:text-red-400 text-center">
                    Link Text
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Info: Blue -->
            <UCard>
              <div class="space-y-3">
                <h4 class="text-base font-semibold text-blue-700 dark:text-blue-400">
                  Info (Blue)
                </h4>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Informational, secondary
                </p>
                <div class="space-y-2">
                  <div class="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold text-center">
                    Button
                  </div>
                  <div class="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-md text-xs text-center">
                    Badge
                  </div>
                  <div class="text-xs text-blue-600 dark:text-blue-400 text-center">
                    Link Text
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Neutral: Gray -->
            <UCard>
              <div class="space-y-3">
                <h4 class="text-base font-semibold text-gray-700 dark:text-gray-400">
                  Neutral (Gray)
                </h4>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Default, secondary actions
                </p>
                <div class="space-y-2">
                  <div class="px-3 py-2 bg-gray-600 text-white rounded-md text-sm font-semibold text-center">
                    Button
                  </div>
                  <div class="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md text-xs text-center">
                    Badge
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 text-center">
                    Link Text
                  </div>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Full Semantic Color Palette Summary -->
          <div class="mt-8 p-6 bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-amber-950 dark:to-emerald-950 rounded-lg border-2 border-amber-400 dark:border-amber-600">
            <h4 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Complete Color System
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p class="font-semibold text-amber-700 dark:text-amber-400 mb-2">Primary Colors:</p>
                <ul class="space-y-1 text-gray-700 dark:text-gray-300">
                  <li><span class="font-semibold">Primary:</span> Amber (treasure, legendary items)</li>
                  <li><span class="font-semibold">Success:</span> Emerald (nature, healing, growth)</li>
                  <li><span class="font-semibold">Warning:</span> Orange (caution, attention)</li>
                  <li><span class="font-semibold">Error:</span> Red (danger, fire, destruction)</li>
                  <li><span class="font-semibold">Info:</span> Blue (arcane, knowledge)</li>
                  <li><span class="font-semibold">Neutral:</span> Gray (default, secondary)</li>
                </ul>
              </div>
              <div>
                <p class="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Usage Examples:</p>
                <ul class="space-y-1 text-gray-700 dark:text-gray-300">
                  <li>🎯 Spell cards: <span class="text-amber-600 dark:text-amber-400">Amber badges</span></li>
                  <li>🌿 Healing potions: <span class="text-emerald-600 dark:text-emerald-400">Emerald badges</span></li>
                  <li>⚠️ Cursed items: <span class="text-orange-600 dark:text-orange-400">Orange warnings</span></li>
                  <li>🔥 Fire damage: <span class="text-red-600 dark:text-red-400">Red danger</span></li>
                  <li>📘 Armor class: <span class="text-blue-600 dark:text-blue-400">Blue info</span></li>
                  <li>📄 Source books: <span class="text-gray-600 dark:text-gray-400">Gray neutral</span></li>
                </ul>
              </div>
            </div>
            <div class="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded">
              <p class="text-xs text-gray-600 dark:text-gray-400">
                <strong>Gray Recommendation:</strong> Use <strong>Stone</strong> gray for warm, parchment-like feel that complements amber/emerald theme.
              </p>
            </div>
          </div>
        </div>

        <!-- Gray Palette Options -->
        <div>
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Gray Palette Options
          </h3>
          <p class="text-base text-gray-600 dark:text-gray-400 mb-6">
            Gray affects text, borders, backgrounds throughout the app
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UCard>
              <div class="space-y-2">
                <h4 class="text-lg font-semibold">Current: Slate (Cool)</h4>
                <div class="h-8 bg-slate-500 rounded"></div>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  Cool-toned, modern, professional
                </p>
              </div>
            </UCard>

            <UCard>
              <div class="space-y-2">
                <h4 class="text-lg font-semibold">Option: Stone (Warm)</h4>
                <div class="h-8 bg-stone-500 rounded"></div>
                <p class="text-sm text-stone-600 dark:text-stone-400">
                  Warm-toned, earthy, parchment-like
                </p>
              </div>
            </UCard>

            <UCard>
              <div class="space-y-2">
                <h4 class="text-lg font-semibold">Option: Zinc (Neutral)</h4>
                <div class="h-8 bg-zinc-500 rounded"></div>
                <p class="text-sm text-zinc-600 dark:text-zinc-400">
                  True neutral, balanced
                </p>
              </div>
            </UCard>

            <UCard>
              <div class="space-y-2">
                <h4 class="text-lg font-semibold">Option: Neutral (True Gray)</h4>
                <div class="h-8 bg-neutral-500 rounded"></div>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">
                  Pure gray, no undertones
                </p>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </section>

    <!-- Performance Note -->
    <section class="mb-8">
      <UCard>
        <div class="flex items-start gap-4">
          <div class="text-3xl">⚡</div>
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Performance Optimized
            </h3>
            <p class="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              This font is loaded via <code class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm">@nuxt/fonts</code> with automatic
              optimization: preloading, font-display swap, and subsetting. Variable font technology means
              all three weights (400, 600, 700) are delivered in a single optimized file.
            </p>
          </div>
        </div>
      </UCard>
    </section>

    <!-- Back to Top -->
    <div class="text-center pt-8">
      <UiBackLink to="/" label="Back to Home" />
    </div>
  </div>
</template>
