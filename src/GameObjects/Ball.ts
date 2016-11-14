import { BoundingBox } from '../CollisionBounders/BoundingBox'
import { GameObject } from './GameObject'

export class Ball extends GameObject {
  readonly radius: number

  constructor(x: number, y: number, radius: number) {
    super(x, y, new BoundingBox(x, y, 2 * radius, 2 * radius, 0.9))
    this.radius = radius
  }

  moveTo(x: number, y: number) {
    return new Ball(x, y, this.radius)
  }
}