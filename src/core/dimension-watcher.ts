import { BehaviorSubject, type Observer } from "rxjs";
import { Vector2 } from "three";

type FnOrObserver = ((data: Vector2) => void) | Observer<Vector2>;

export class DimensionWatcher {
  private dom: HTMLElement;
  private observable: ResizeObserver;
  private behaviorSubject: BehaviorSubject<Vector2>;

  constructor(dom: HTMLElement) {
    this.dom = dom;
    this.observable = new ResizeObserver(this.onResize.bind(this));
    this.behaviorSubject = new BehaviorSubject(new Vector2(0, 0));

    this.observable.observe(this.dom);
  }

  subscribe(fnOrObserver: FnOrObserver) {
    return this.behaviorSubject.subscribe(fnOrObserver);
  }

  private onResize(entries: ResizeObserverEntry[]) {
    entries.forEach(entry => {
      if (!entry.contentRect) return;
      const vector = new Vector2(entry.contentRect.width, entry.contentRect.height);
      this.behaviorSubject.next(vector);
    });
  }
}