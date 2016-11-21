import { Game } from './Game'
import { Settings } from './Settings'

const DEFAULT_SETTINGS: Settings = {
  CANVAS_WIDTH: 480,
  CANVAS_HEIGHT: 320,
  BALL_RADIUS: 10,
  BRICK_HEIGHT: 20,
  BRICK_WIDTH: 65,
  PADDLE_WIDTH: 100,
  PADDLE_HEIGHT: 10,
  LINE_WIDTH: 2,
  LINE_COLOR: '#E3F2FD',
  FILL_COLOR: '#42A5F5',
  BALL_SPEED: 60,
  PADDLE_SPEED: 240,
  FRAME_RATE: 1000 / 60
}

export = function (canvas: HTMLCanvasElement, settings) {
  const main = new Game(
    canvas,
    Object.assign(DEFAULT_SETTINGS, settings)
  )
  main.init()
}
