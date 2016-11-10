import { BoundingBox } from '../CollisionBounders/BoundingBox'
import { GameObject } from './GameObject'

export class Ball extends GameObject {
  radius: number

  constructor(x: number, y: number, radius: number) {
    const boundingBox = new BoundingBox(x, y, 2 * radius, 2 * radius, 1)
    super(x, y, boundingBox)
    this.radius = radius
  }
}