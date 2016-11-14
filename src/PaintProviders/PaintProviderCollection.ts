import { PaintProvider } from './PaintProvider'

export class PaintProviderCollection {
  constructor(private collection: Map<Function, PaintProvider> = new Map) {}

  add(objectClass: Function, provider: PaintProvider) {
    this.collection.set(objectClass, provider)
    return this
  }

  get(objectClass: Function): PaintProvider | void {
    return this.collection.get(objectClass)
  }
}
