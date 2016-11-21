import { Painter } from './Painter'
import { Settings } from './Settings'
import { Text } from './GameObjects/Text'
import { Observable, Subscription } from 'rxjs'

export class WelcomeScreen {
  private subscription: Subscription

  constructor(
    private painter: Painter,
    private settings: Settings,
    private onStart: () => void
  ) {}

  show() {
    const text = new Text(
      this.settings.CANVAS_WIDTH / 2,
      this.settings.CANVAS_HEIGHT / 2,
      'Press ENTER to start'
    )
    this.painter.paint(text)

    this.subscription = Observable
      .fromEvent<KeyboardEvent>(document, 'keydown')
      .filter(e => e.keyCode === 13)
      .subscribe(this.start.bind(this))
  }

  private start() {
    this.onStart()
    this.subscription.unsubscribe()
  }

}
