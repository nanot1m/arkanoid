import { PaintProvider } from './PaintProvider'

export interface TextObject {
  x: number,
  y: number,
  text: string,
  fontSize?: number
}

export const TextPaintProvider: PaintProvider = {
  paint(context: CanvasRenderingContext2D, obj: TextObject) {
    context.beginPath()
    context.font = `${obj.fontSize || 24}px monospace`
    context.textAlign = 'center'
    context.fillText(obj.text, obj.x, obj.y);
    context.closePath()
  }
}
