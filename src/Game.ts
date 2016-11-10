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
import set = Reflect.set

export class Game {
  private context: CanvasRenderingContext2D
  private painter: Painter
  private levels: GameLevel[] = []

  constructor(
    private canvas: HTMLCanvasElement,
    private settings: Settings,
    devicePixelRatio?: number
  ) {
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (devicePixelRatio) {
      this.scale(devicePixelRatio)
    }
  }

  init() {
    this.setupCanvas()
    this.setupContext()
    this.setupPainter()

    this.startLevel(0)
  }

  private startLevel(index: number) {
    createLevel(this.painter, this.settings).render()
  }

  private setupCanvas() {
    this.canvas.width = this.settings.CANVAS_WIDTH
    this.canvas.height = this.settings.CANVAS_HEIGHT
  }

  private setupContext() {
    this.context.lineWidth = this.settings.LINE_WIDTH
    this.context.strokeStyle = this.settings.STROKE_COLOR
  }

  private setupPainter() {
    const paintProviders = new PaintProviderCollection()
      .add(Ball, SpherePaintProvider)
      .add(Paddle, RectPaintProvider)
      .add(Brick, RectPaintProvider)
      .add(Border, RectPaintProvider)

    this.painter = new Painter(this.context, paintProviders)
  }

  private scale(ratio) {
    this.context.scale(ratio, ratio)
    Object.keys(this.settings).forEach(setting => {
      if (setting.includes('WIDTH') ||
          setting.includes('HEIGHT') ||
          setting.includes('RADIUS')
      ) {
        this.settings[setting] *= ratio
      }
    })
  }
}

function createLevel(painter: Painter, settings: Settings) {
  const paddle = new Paddle(
    settings.CANVAS_WIDTH / 2,
    settings.CANVAS_HEIGHT - settings.PADDLE_HEIGHT / 2 - 10,
    settings.PADDLE_WIDTH,
    settings.PADDLE_HEIGHT
  )
  const ball = new Ball(
    settings.CANVAS_WIDTH / 2,
    settings.CANVAS_HEIGHT - settings.PADDLE_HEIGHT - settings.BALL_RADIUS - 10,
    settings.BALL_RADIUS,
  )
  const brick = new Brick(
    settings.CANVAS_WIDTH / 2,
    settings.CANVAS_HEIGHT / 2,
    settings.BRICK_WIDTH,
    settings.BRICK_HEIGHT
  )
  const boundaries = [
    new Border(
      0, settings.CANVAS_HEIGHT / 2,
      0, settings.CANVAS_HEIGHT
    ),
    new Border(
      settings.CANVAS_WIDTH / 2, 0,
      settings.CANVAS_WIDTH, 0
    ),
    new Border(
      settings.CANVAS_WIDTH, settings.CANVAS_HEIGHT / 2,
      0, settings.CANVAS_HEIGHT
    ),
    new Border(
      settings.CANVAS_WIDTH / 2, settings.CANVAS_HEIGHT,
      settings.CANVAS_WIDTH, 0
    )
  ]

  return new GameLevel(
    paddle,
    ball,
    [brick],
    boundaries,
    painter
  )
}