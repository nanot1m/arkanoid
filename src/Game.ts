import { Settings } from './Settings'
import { PaintProviderCollection } from './PaintProviders/PaintProviderCollection'
import { SpherePaintProvider } from './PaintProviders/SpherePaintProvider'
import { Ball } from './GameObjects/Ball'
import { RectPaintProvider } from './PaintProviders/RectPaintProvider'
import { Paddle } from './GameObjects/Paddle'
import { Brick } from './GameObjects/Brick'
import { Painter } from './Painter'
import { GameLevel } from './GameLevel'
import { Border } from './GameObjects/Border'
import { SoundDriver } from './SoundDriver'
import set = Reflect.set


export class Game {
  private context: CanvasRenderingContext2D
  private painter: Painter
  private levels: GameLevel[] = []
  private soundDriver: typeof SoundDriver

  constructor(private canvas: HTMLCanvasElement,
              private settings: Settings,
              devicePixelRatio?: number) {
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (devicePixelRatio) {
      this.scale(devicePixelRatio)
    }
  }

  init() {
    this.setupCanvas()
    this.setupContext()
    this.setupPainter()
    this.setupSoundDriver()

    this.startLevel(0)
  }

  private startLevel(index: number) {
    createLevel(this.painter, this.settings).start()
  }

  private setupCanvas() {
    this.canvas.width = this.settings.CANVAS_WIDTH
    this.canvas.height = this.settings.CANVAS_HEIGHT
  }

  private setupContext() {
    this.context.lineWidth = this.settings.LINE_WIDTH
    this.context.fillStyle = this.settings.FILL_COLOR
    this.context.strokeStyle = this.settings.LINE_COLOR
  }

  private setupPainter() {
    const paintProviders = new PaintProviderCollection()
      .add(Ball, SpherePaintProvider)
      .add(Paddle, RectPaintProvider)
      .add(Brick, RectPaintProvider)
      .add(Border, RectPaintProvider)

    this.painter = new Painter(this.context, paintProviders)
  }

  private setupSoundDriver() {
    this.soundDriver = SoundDriver
  }

  private scale(ratio) {
    this.context.scale(ratio, ratio)
    Object.keys(this.settings).forEach(setting => {
      if (setting.includes('WIDTH') ||
        setting.includes('HEIGHT') ||
        setting.includes('RADIUS') ||
        setting.includes('SPEED')
      ) {
        this.settings[setting] *= ratio
      }
    })
  }
}

function createLevel(painter: Painter, settings: Settings) {
  const bricksInRow = 6
  const gap = Math.round((settings.CANVAS_WIDTH - bricksInRow * settings.BRICK_WIDTH) / (bricksInRow + 1))
  const ROWS = 4
  const bricks = Array(bricksInRow * ROWS)
    .fill(0)
    .map((_, i) => new Brick(
      (settings.BRICK_WIDTH + gap) * Math.floor(i / ROWS) + settings.BRICK_WIDTH / 2 + gap,
      (settings.BRICK_HEIGHT + gap) * (i % ROWS) + settings.BRICK_HEIGHT / 2 + gap,
      settings.BRICK_WIDTH,
      settings.BRICK_HEIGHT
    ))

  return new GameLevel(
    bricks,
    painter,
    settings
  )
}