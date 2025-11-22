// Die types with their number of faces
type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20'

const DIE_FACES: Record<DieType, number> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20
}

// Distribution weights for die types (d20 most common)
const DIE_WEIGHTS: Array<{ type: DieType; weight: number }> = [
  { type: 'd20', weight: 35 },
  { type: 'd12', weight: 15 },
  { type: 'd10', weight: 15 },
  { type: 'd8', weight: 15 },
  { type: 'd6', weight: 10 },
  { type: 'd4', weight: 10 }
]

/**
 * Parchment background layer
 * Creates animated aged paper texture
 */
export class ParchmentBackground {
  private offsetX = 0
  private offsetY = 0
  private scale = 1
  private scaleDirection = 1
  private noiseData: ImageData | null = null

  constructor(
    private width: number,
    private height: number,
    private isDark: boolean
  ) {}

  /**
   * Generate parchment texture using Perlin-like noise
   */
  generateTexture(ctx: CanvasRenderingContext2D): void {
    const imageData = ctx.createImageData(this.width, this.height)
    const data = imageData.data

    // Base colors for parchment
    const baseColor = this.isDark
      ? { r: 35, g: 32, b: 28 }   // Dark vellum (warm dark brown)
      : { r: 245, g: 237, b: 220 } // Aged parchment (cream)

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const i = (y * this.width + x) * 4

        // Simple noise using position-based randomness
        const noise = (Math.sin(x * 0.02) + Math.cos(y * 0.03)) * 10

        // Add variation
        data[i] = Math.min(255, baseColor.r + noise)     // R
        data[i + 1] = Math.min(255, baseColor.g + noise) // G
        data[i + 2] = Math.min(255, baseColor.b + noise) // B
        data[i + 3] = this.isDark ? 180 : 120            // Alpha (more opaque in dark mode)
      }
    }

    this.noiseData = imageData
  }

  update(deltaTime: number): void {
    const dt = deltaTime / 1000

    // Very slow diagonal drift (completes full cycle in ~2 minutes)
    this.offsetX += dt * 2
    this.offsetY += dt * 1.5

    // Gentle breathing effect (zoom in/out by 0.5%)
    this.scale += this.scaleDirection * dt * 0.0002
    if (this.scale > 1.005) this.scaleDirection = -1
    if (this.scale < 0.995) this.scaleDirection = 1

    // Wrap offsets
    if (this.offsetX > 100) this.offsetX = 0
    if (this.offsetY > 100) this.offsetY = 0
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.noiseData) this.generateTexture(ctx)
    if (!this.noiseData) return

    ctx.save()

    // Apply scale transform from center
    ctx.translate(this.width / 2, this.height / 2)
    ctx.scale(this.scale, this.scale)
    ctx.translate(-this.width / 2, -this.height / 2)

    // Apply offset
    ctx.translate(this.offsetX, this.offsetY)

    // Draw parchment texture
    ctx.putImageData(this.noiseData, 0, 0)

    ctx.restore()
  }
}

/**
 * 3D Tumbling Die
 */
export class Die {
  x: number
  y: number
  vx: number
  vy: number
  type: DieType
  size: number
  rotX: number
  rotY: number
  rotZ: number
  rotSpeedX: number
  rotSpeedY: number
  rotSpeedZ: number
  opacity: number
  currentFace: number
  glowIntensity: number
  private width: number
  private height: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height

    // Random position
    this.x = Math.random() * width
    this.y = Math.random() * height

    // Random velocity (slow drift)
    this.vx = (Math.random() - 0.5) * 20
    this.vy = (Math.random() - 0.5) * 20

    // Select die type based on weights
    this.type = this.selectDieType()

    // Random size (30-70px)
    this.size = 30 + Math.random() * 40

    // Random 3D rotations
    this.rotX = Math.random() * Math.PI * 2
    this.rotY = Math.random() * Math.PI * 2
    this.rotZ = Math.random() * Math.PI * 2

    // Rotation speeds (degrees per second)
    this.rotSpeedX = (Math.random() - 0.5) * 0.5
    this.rotSpeedY = (Math.random() - 0.5) * 0.5
    this.rotSpeedZ = (Math.random() - 0.5) * 0.5

    // Opacity (0.1-0.3)
    this.opacity = 0.1 + Math.random() * 0.2

    // Current face showing
    this.currentFace = Math.floor(Math.random() * DIE_FACES[this.type]) + 1

    // Glow intensity for critical hits
    this.glowIntensity = 0
  }

  private selectDieType(): DieType {
    const totalWeight = DIE_WEIGHTS.reduce((sum, d) => sum + d.weight, 0)
    let random = Math.random() * totalWeight

    for (const { type, weight } of DIE_WEIGHTS) {
      random -= weight
      if (random <= 0) return type
    }

    return 'd20' // Fallback
  }

  update(deltaTime: number): void {
    const dt = deltaTime / 1000

    // Update position
    this.x += this.vx * dt
    this.y += this.vy * dt

    // Wrap around edges
    if (this.x > this.width + this.size) this.x = -this.size
    if (this.x < -this.size) this.x = this.width + this.size
    if (this.y > this.height + this.size) this.y = -this.size
    if (this.y < -this.size) this.y = this.height + this.size

    // Update rotations
    this.rotX += this.rotSpeedX * dt
    this.rotY += this.rotSpeedY * dt
    this.rotZ += this.rotSpeedZ * dt

    // Occasionally "roll" to new face
    if (Math.random() < 0.001) {
      this.currentFace = Math.floor(Math.random() * DIE_FACES[this.type]) + 1

      // Critical hit effect for d20 rolling 20
      if (this.type === 'd20' && this.currentFace === 20) {
        this.glowIntensity = 1.0
      }
    }

    // Fade glow
    if (this.glowIntensity > 0) {
      this.glowIntensity -= dt * 0.8
      if (this.glowIntensity < 0) this.glowIntensity = 0
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string): void {
    ctx.save()

    ctx.translate(this.x, this.y)

    // Simulate 3D rotation with 2D transform
    const perspective = 0.6
    const cosX = Math.cos(this.rotX)
    const sinY = Math.sin(this.rotY)

    ctx.transform(
      cosX * Math.cos(this.rotZ),
      cosX * Math.sin(this.rotZ),
      sinY * -Math.sin(this.rotZ),
      sinY * Math.cos(this.rotZ),
      0,
      0
    )

    // Glow effect for critical hits
    if (this.glowIntensity > 0) {
      const glowColor = color.replace('OPACITY', (this.glowIntensity * 0.5).toString())
      ctx.shadowBlur = 20 * this.glowIntensity
      ctx.shadowColor = glowColor
    }

    // Draw die outline
    ctx.strokeStyle = color.replace('OPACITY', this.opacity.toString())
    ctx.lineWidth = 2
    ctx.beginPath()

    // Different shapes for different dice
    if (this.type === 'd4') {
      // Triangle (pyramid viewed from above)
      ctx.moveTo(0, -this.size * 0.7)
      ctx.lineTo(-this.size * 0.6, this.size * 0.35)
      ctx.lineTo(this.size * 0.6, this.size * 0.35)
      ctx.closePath()
    } else if (this.type === 'd6') {
      // Square
      ctx.rect(-this.size * 0.4, -this.size * 0.4, this.size * 0.8, this.size * 0.8)
    } else if (this.type === 'd8') {
      // Octagon
      const sides = 8
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2
        const x = Math.cos(angle) * this.size * 0.5
        const y = Math.sin(angle) * this.size * 0.5
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
    } else {
      // Circle for d10, d12, d20
      ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2)
    }

    ctx.stroke()

    // Draw face number
    const faceOpacity = Math.min(this.opacity + this.glowIntensity * 0.3, 0.6)
    ctx.fillStyle = color.replace('OPACITY', faceOpacity.toString())
    ctx.font = `bold ${this.size * 0.4}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(this.currentFace.toString(), 0, 0)

    ctx.restore()
  }
}

/**
 * Magical sparkle particle
 */
export class MagicParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
  trail: Array<{ x: number; y: number; opacity: number }>
  private width: number
  private height: number
  private pathPhase: number

  constructor(width: number, height: number, hue: number = 260) {
    this.width = width
    this.height = height

    // Random position
    this.x = Math.random() * width
    this.y = Math.random() * height

    // Random velocity
    this.vx = (Math.random() - 0.5) * 30
    this.vy = (Math.random() - 0.5) * 30

    // Size (2-6px)
    this.size = 2 + Math.random() * 4

    // Opacity (0.2-0.5)
    this.opacity = 0.2 + Math.random() * 0.3

    // Color hue (for variety)
    this.hue = hue + (Math.random() - 0.5) * 40

    // Trail positions
    this.trail = []

    // Path phase for curved movement
    this.pathPhase = Math.random() * Math.PI * 2
  }

  update(deltaTime: number): void {
    const dt = deltaTime / 1000

    // Update path phase for curved movement
    this.pathPhase += dt * 2

    // Update position with sine wave
    this.x += this.vx * dt + Math.sin(this.pathPhase) * 0.5
    this.y += this.vy * dt + Math.cos(this.pathPhase) * 0.5

    // Wrap around edges
    if (this.x > this.width) this.x = 0
    if (this.x < 0) this.x = this.width
    if (this.y > this.height) this.y = 0
    if (this.y < 0) this.y = this.height

    // Update trail
    this.trail.unshift({ x: this.x, y: this.y, opacity: this.opacity })
    if (this.trail.length > 5) this.trail.pop()

    // Fade trail
    for (let i = 0; i < this.trail.length; i++) {
      this.trail[i]!.opacity *= 0.9
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save()

    // Draw trail
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const point = this.trail[i]!
      ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${point.opacity * 0.3})`
      ctx.beginPath()
      ctx.arc(point.x, point.y, this.size * (0.3 + i * 0.1), 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw main particle (star shape)
    ctx.fillStyle = `hsla(${this.hue}, 80%, 80%, ${this.opacity})`
    ctx.shadowBlur = 8
    ctx.shadowColor = `hsla(${this.hue}, 80%, 80%, ${this.opacity})`

    // Draw 4-pointed star
    ctx.beginPath()
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 - Math.PI / 2
      const outerX = this.x + Math.cos(angle) * this.size
      const outerY = this.y + Math.sin(angle) * this.size
      const innerAngle = angle + Math.PI / 4
      const innerX = this.x + Math.cos(innerAngle) * this.size * 0.4
      const innerY = this.y + Math.sin(innerAngle) * this.size * 0.4

      if (i === 0) ctx.moveTo(outerX, outerY)
      else ctx.lineTo(outerX, outerY)
      ctx.lineTo(innerX, innerY)
    }
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  }
}

interface ColorPalette {
  dieColor: string
  particleHue: number
}

const LIGHT_MODE_COLORS: ColorPalette = {
  dieColor: 'rgba(79, 70, 229, OPACITY)', // indigo-600
  particleHue: 260 // Purple/violet
}

const DARK_MODE_COLORS: ColorPalette = {
  dieColor: 'rgba(167, 139, 250, OPACITY)', // violet-400
  particleHue: 180 // Cyan
}

export function shouldAnimate(): boolean {
  if (typeof window === 'undefined') return false

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  return !mediaQuery.matches
}

export function useAnimatedBackground(canvas: HTMLCanvasElement, isDark: boolean) {
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas context not available')

  const ctx: CanvasRenderingContext2D = context

  let parchment: ParchmentBackground | null = null
  let dice: Die[] = []
  let particles: MagicParticle[] = []
  let animationFrameId: number | null = null
  let lastTime = 0

  const colors = isDark ? DARK_MODE_COLORS : LIGHT_MODE_COLORS

  // Visibility change handler
  function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      stop()
    } else {
      start()
    }
  }

  function initialize() {
    const width = canvas.width
    const height = canvas.height

    // Create parchment background
    parchment = new ParchmentBackground(width, height, isDark)

    // Create 15-18 dice
    const diceCount = 15 + Math.floor(Math.random() * 4)
    dice = Array.from({ length: diceCount }, () => new Die(width, height))

    // Create 35-40 magic particles
    const particleCount = 35 + Math.floor(Math.random() * 6)
    particles = Array.from({ length: particleCount }, () => new MagicParticle(width, height, colors.particleHue))

    // Listen for visibility changes
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange)
    }
  }

  function animate(currentTime: number) {
    animationFrameId = requestAnimationFrame(animate)

    if (!lastTime) lastTime = currentTime
    const deltaTime = currentTime - lastTime

    // Throttle to 30 FPS (33.33ms per frame)
    if (deltaTime < 33) {
      return
    }

    lastTime = currentTime

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Layer 1: Parchment background
    if (parchment) {
      parchment.update(deltaTime)
      parchment.draw(ctx)
    }

    // Layer 2: Magic particles (behind dice)
    for (const particle of particles) {
      particle.update(deltaTime)
      particle.draw(ctx)
    }

    // Layer 3: Dice (on top)
    for (const die of dice) {
      die.update(deltaTime)
      die.draw(ctx, colors.dieColor)
    }
  }

  function start() {
    if (animationFrameId !== null) return
    lastTime = 0
    animationFrameId = requestAnimationFrame(animate)
  }

  function stop() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
      lastTime = 0
    }
  }

  function cleanup() {
    stop()
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }

  function isRunning() {
    return animationFrameId !== null
  }

  function getParticleCount() {
    return dice.length + particles.length + (parchment ? 1 : 0)
  }

  return {
    initialize,
    start,
    stop,
    cleanup,
    isRunning,
    getParticleCount
  }
}
