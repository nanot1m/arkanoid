import { GameObject } from './GameObject'

export class Text extends GameObject {
  readonly text: string
  readonly fontSize: number

  constructor(x: number, y: number, text: string, fontSize?: number) {
    super(x, y)
    this.text = text
    if (fontSize) {
      this.fontSize = fontSize
    }
  }

  moveTo(x: number, y: number) {
    return new Text(x, y, this.text, this.fontSize)
  }
}