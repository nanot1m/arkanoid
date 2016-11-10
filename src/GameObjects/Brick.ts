import { BoundingBox } from '../CollisionBounders/BoundingBox'
import { GameObject } from './GameObject'

export class Brick extends GameObject {
  width: number
  height: number

  constructor(x, y, width, height) {
    const boundingBox = new BoundingBox(x, y, width, height, 1)
    super(x, y, boundingBox)
    this.width = width
    this.height = height
  }
}
