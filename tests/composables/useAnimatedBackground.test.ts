import { describe, it, expect, vi } from 'vitest'

describe('useAnimatedBackground', () => {
  describe('MagicParticle class', () => {
    it('initializes with random position within bounds', async () => {
      const { MagicParticle } = await import('~/composables/useAnimatedBackground')

      const particle = new MagicParticle(1920, 1080)

      expect(particle.x).toBeGreaterThanOrEqual(0)
      expect(particle.x).toBeLessThanOrEqual(1920)
      expect(particle.y).toBeGreaterThanOrEqual(0)
      expect(particle.y).toBeLessThanOrEqual(1080)
      expect(particle.size).toBeGreaterThanOrEqual(2)
      expect(particle.size).toBeLessThanOrEqual(8)
    })

    it('updates position based on velocity', async () => {
      const { MagicParticle } = await import('~/composables/useAnimatedBackground')

      const particle = new MagicParticle(1920, 1080)
      const initialX = particle.x
      const initialY = particle.y

      particle.update(16) // One frame at 60fps

      // Position should have changed (drift + velocity)
      const moved = particle.x !== initialX || particle.y !== initialY
      expect(moved).toBe(true)
    })

    it('wraps around screen edges', async () => {
      const { MagicParticle } = await import('~/composables/useAnimatedBackground')

      const particle = new MagicParticle(100, 100)

      // Move beyond right edge
      particle.x = 110
      particle.update(16)
      expect(particle.x).toBeLessThanOrEqual(100)

      // Move beyond bottom edge
      particle.y = 110
      particle.update(16)
      expect(particle.y).toBeLessThanOrEqual(100)

      // Move beyond left edge
      particle.x = -10
      particle.update(16)
      expect(particle.x).toBeGreaterThanOrEqual(0)

      // Move beyond top edge
      particle.y = -10
      particle.update(16)
      expect(particle.y).toBeGreaterThanOrEqual(0)
    })

    it('applies mouse repulsion force', async () => {
      const { MagicParticle } = await import('~/composables/useAnimatedBackground')

      const particle = new MagicParticle(1000, 1000)
      particle.x = 500
      particle.y = 500
      const initialVX = particle.vx
      const initialVY = particle.vy

      // Mouse very close to particle (within 150px radius)
      particle.applyMouseForce(510, 510)

      // Velocity should have changed (repulsion applied)
      const velocityChanged = particle.vx !== initialVX || particle.vy !== initialVY
      expect(velocityChanged).toBe(true)
    })

    it('applies scroll momentum', async () => {
      const { MagicParticle } = await import('~/composables/useAnimatedBackground')

      const particle = new MagicParticle(1000, 1000)
      const initialVY = particle.vy

      particle.applyScrollMomentum(100) // Scroll down 100px

      // Vertical velocity should increase
      expect(particle.vy).toBeGreaterThan(initialVY)
    })

    it('draws particle with shape variation', async () => {
      const { MagicParticle } = await import('~/composables/useAnimatedBackground')

      const canvas = document.createElement('canvas')
      canvas.width = 200
      canvas.height = 200
      const ctx = canvas.getContext('2d')!

      const particle = new MagicParticle(200, 200)

      // Should not throw
      expect(() => particle.draw(ctx)).not.toThrow()

      // Particle should have a shape type
      expect(['star4', 'circle', 'diamond', 'hexagon', 'cross']).toContain(particle.shape)
    })
  })

  describe('ParchmentBackground class', () => {
    it('initializes with dimensions', async () => {
      const { ParchmentBackground } = await import('~/composables/useAnimatedBackground')

      const parchment = new ParchmentBackground(1920, 1080, false)

      // Should not throw during initialization
      expect(parchment).toBeDefined()
    })

    it('updates scroll offset', async () => {
      const { ParchmentBackground } = await import('~/composables/useAnimatedBackground')

      const parchment = new ParchmentBackground(1920, 1080, false)

      parchment.updateScroll(100) // Scroll down 100px

      // Should not throw
      expect(() => parchment.update(16)).not.toThrow()
    })

    it('draws parchment background', async () => {
      const { ParchmentBackground } = await import('~/composables/useAnimatedBackground')

      const canvas = document.createElement('canvas')
      canvas.width = 200
      canvas.height = 200
      const ctx = canvas.getContext('2d')!

      const parchment = new ParchmentBackground(200, 200, false)

      // Should not throw
      expect(() => parchment.draw(ctx)).not.toThrow()
    })
  })

  describe('shouldAnimate function', () => {
    it('returns false when prefers-reduced-motion is set', async () => {
      const { shouldAnimate } = await import('~/composables/useAnimatedBackground')

      // Mock matchMedia to simulate prefers-reduced-motion
      const matchMediaMock = vi.fn(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))

      vi.stubGlobal('matchMedia', matchMediaMock)

      const result = shouldAnimate()

      // User prefers reduced motion, so should not animate
      expect(result).toBe(false)

      vi.unstubAllGlobals()
    })

    it('returns true when prefers-reduced-motion is not set', async () => {
      const { shouldAnimate } = await import('~/composables/useAnimatedBackground')

      // Mock matchMedia to simulate normal motion preferences
      const matchMediaMock = vi.fn(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))

      vi.stubGlobal('matchMedia', matchMediaMock)

      const result = shouldAnimate()

      // User allows motion, so should animate
      expect(result).toBe(true)

      vi.unstubAllGlobals()
    })
  })
})
