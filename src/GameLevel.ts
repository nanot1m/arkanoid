import { Paddle } from './GameObjects/Paddle'
import { Ball } from './GameObjects/Ball'
import { Brick } from './GameObjects/Brick'
import { Border } from './GameObjects/Border'
import { Painter } from './Painter'

export class GameLevel {
  constructor(
    private paddle: Paddle,
    private ball: Ball,
    private bricks: Brick[],
    private borders: Border[], // left, top, right, bottom,
    private painter: Painter
  ) {}

  render() {
    this.borders.forEach(this.painter.paint, this.painter)
    this.painter.paint(this.paddle)
    this.painter.paint(this.ball)
    this.bricks.forEach(this.painter.paint, this.painter)
  }
}