import { BoundingBox } from '../CollisionBounders/BoundingBox'

export class GameObject {
  private boundingBoxOffsetX: number
  private boundingBoxOffsetY: number

  constructor(readonly x: number, readonly y: number, public boundingBox: BoundingBox) {
    this.boundingBoxOffsetX = x - boundingBox.x
    this.boundingBoxOffsetY = y - boundingBox.y
  }

  collides(obj: GameObject) {
    return BoundingBox.isCollide(this.boundingBox, obj.boundingBox)
  }

  moveTo(x:number, y:number): GameObject {
    return new GameObject(x, y, this.boundingBox)
  }
}