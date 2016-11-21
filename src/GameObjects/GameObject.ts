import { BoundingBox } from '../CollisionBounders/BoundingBox'

export class GameObject {
  private boundingBoxOffsetX: number
  private boundingBoxOffsetY: number

  boundingBox: BoundingBox

  constructor(readonly x: number, readonly y: number, boundingBox?: BoundingBox) {
    if (boundingBox) {
      this.boundingBoxOffsetX = x - boundingBox.x
      this.boundingBoxOffsetY = y - boundingBox.y
      this.boundingBox = boundingBox
    }
  }

  collides(obj: GameObject) {
    if (!this.boundingBox) {
      return false
    }
    return BoundingBox.isCollide(this.boundingBox, obj.boundingBox)
  }

  moveTo(x:number, y:number): GameObject {
    return new GameObject(x, y, this.boundingBox)
  }
}