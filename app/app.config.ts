export default defineAppConfig({
  ui: {
    // Color scheme - Amber & Emerald Fantasy Theme
    colors: {
      primary: 'amber',     // Main actions, links - Treasure, legendary items
      success: 'emerald',   // Positive actions - Nature, healing, growth
      warning: 'orange',    // Caution, notices - Cursed items, important
      error: 'red',         // Danger, destruction - Fire damage, danger
      info: 'blue',         // Informational - Arcane knowledge, AC
      neutral: 'stone'      // Default, secondary - Source books, gray text
    },

    // Global component overrides for proper styling
    selectMenu: {
      // Ensure dropdown content has proper background in both modes
      content: 'bg-white dark:bg-gray-900'
    },

    card: {
      // Ensure cards have proper backgrounds
      background: 'bg-white dark:bg-gray-900'
    }
  }
})
