import { BoundingBox } from '../CollisionBounders/BoundingBox'

export class GameObject {
  private _x: number
  private _y: number
  private boundingBoxOffsetX: number
  private boundingBoxOffsetY: number

  constructor(x: number, y: number, public boundingBox: BoundingBox) {
    this._x = x
    this._y = y
    this.boundingBox = boundingBox
    this.boundingBoxOffsetX = x - boundingBox.x
    this.boundingBoxOffsetY = y - boundingBox.y
  }

  collides(obj: GameObject) {
    return BoundingBox.isCollide(this.boundingBox, obj.boundingBox)
  }

  moveTo(x, y): void {
    this.x = x
    this.y = y
  }

  get x(): number {
    return this._x
  }

  set x(value: number) {
    this._x = value
    if (this.boundingBox) {
      this.boundingBox.x = value - this.boundingBoxOffsetX
    }
  }

  get y(): number {
    return this._y
  }

  set y(value: number) {
    this._y = value
    if (this.boundingBox) {
      this.boundingBox.y = value - this.boundingBoxOffsetY
    }
  }
}