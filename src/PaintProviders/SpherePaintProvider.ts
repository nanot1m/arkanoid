import { PaintProvider } from './PaintProvider'

export interface SphereObject {
  x: number,
  y: number,
  radius: number
}

export const SpherePaintProvider: PaintProvider = {
  paint(context: CanvasRenderingContext2D, obj: SphereObject) {
    context.beginPath()
    context.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2)
    context.stroke()
    context.closePath()
  }
}
