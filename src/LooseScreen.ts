import { Painter } from './Painter'
import { Settings } from './Settings'
import { Text } from './GameObjects/Text'

export class LooseScreen {
  constructor(
    private painter: Painter,
    private settings: Settings
  ) {}

  show() {
    const text = new Text(
      this.settings.CANVAS_WIDTH / 2,
      this.settings.CANVAS_HEIGHT / 2,
      'YOU LOST'
    )
    this.painter.paint(text)
  }

}
