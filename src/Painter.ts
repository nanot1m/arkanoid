import { GameObject } from './GameObjects/GameObject'
import { PaintProviderCollection } from './PaintProviders/PaintProviderCollection'

export class Painter {
  constructor(
    private context: CanvasRenderingContext2D,
    private paintProviders: PaintProviderCollection
  ) {}

  paint(obj: GameObject) {
    const paintProvider = this.paintProviders.get(obj.constructor)
    if (!paintProvider) {
      throw `Paint provider for ${obj.constructor.name} not found`
    }
    paintProvider.paint(this.context, obj)
  }
}
