import { PaintProvider } from './PaintProvider'

export interface RectObject {
  x: number,
  y: number,
  width: number,
  height: number
}

export const RectPaintProvider: PaintProvider = {
  paint(context: CanvasRenderingContext2D, obj: RectObject) {
    context.beginPath()
    context.rect(obj.x - obj.width / 2, obj.y - obj.height / 2, obj.width, obj.height)
    context.stroke()
    context.closePath()
  }
}
