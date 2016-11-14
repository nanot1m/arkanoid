export class BoundingBox {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public offset: number
  ) {}

  static isCollide(obj1: BoundingBox, obj2: BoundingBox): boolean {

    const left1 = obj1.x - obj1.width / 2 * obj1.offset
    const left2 = obj2.x - obj2.width / 2 * obj2.offset
    const right1 = obj1.x + obj1.width / 2 * obj1.offset
    const right2 = obj2.x + obj2.width / 2 * obj2.offset

    const top1 = obj1.y - obj1.height / 2 * obj1.offset
    const top2 = obj2.y - obj2.height / 2 * obj2.offset
    const bottom1 = obj1.y + obj1.height / 2 * obj1.offset
    const bottom2 = obj2.y + obj2.height / 2 * obj2.offset

    return left1 < right2 &&
           right1 > left2 &&
           top1 < bottom2 &&
           bottom1 > top2
  }
}