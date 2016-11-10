import { Game } from './Game'

export = function (canvas: HTMLCanvasElement) {
  const main = new Game(
    canvas, {
      CANVAS_WIDTH: 640,
      CANVAS_HEIGHT: 480,
      BALL_RADIUS: 10,
      BRICK_HEIGHT: 20,
      BRICK_WIDTH: 40,
      PADDLE_WIDTH: 100,
      PADDLE_HEIGHT: 15,
      LINE_WIDTH: 3,
      STROKE_COLOR: 'green'
    },
    window.devicePixelRatio
  )
  main.init()
}
