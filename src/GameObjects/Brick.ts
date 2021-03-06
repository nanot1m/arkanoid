import { BoundingBox } from '../CollisionBounders/BoundingBox'
import { GameObject } from './GameObject'

export class Brick extends GameObject {
  readonly width: number
  readonly height: number

  constructor(x, y, width, height) {
    const boundingBox = new BoundingBox(x, y, width, height, 1)
    super(x, y, boundingBox)
    this.width = width
    this.height = height
  }

  moveTo(x, y) {
    return new Brick(x, y, this.width, this.height)
  }
}
