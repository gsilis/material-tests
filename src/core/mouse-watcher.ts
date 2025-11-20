import { BehaviorSubject, fromEvent, type Observable, type Observer, type Subscription } from "rxjs";
import { Vector2 } from "three";
import type { DimensionWatcher } from "./dimension-watcher";

type FnOrObserver = ((data: Vector2) => void) | Observer<Vector2>;

export class MouseWatcher {
  private dom: HTMLElement;
  private moveObservable: Observable<MouseEvent>;
  private downObservable: Observable<MouseEvent>;
  private upObservable: Observable<MouseEvent>;
  private dimensionWatcher: DimensionWatcher;
  private dimensions: Vector2 = new Vector2(0, 0);
  private position: Vector2 = new Vector2(0, 0);
  private behaviorSubject: BehaviorSubject<Vector2>;
  private pressed: boolean = false;

  private moveSubscription?: Subscription;
  private downSubscription?: Subscription;
  private upSubscription?: Subscription;

  constructor(dom: HTMLElement, dimensions: DimensionWatcher) {
    this.dom = dom;
    this.dimensionWatcher = dimensions;
    this.moveObservable = fromEvent<MouseEvent>(this.dom, 'mousemove');
    this.downObservable = fromEvent<MouseEvent>(this.dom, 'mousedown');
    this.upObservable = fromEvent<MouseEvent>(window, 'mouseup');
    this.behaviorSubject = new BehaviorSubject(this.position);

    this.moveSubscription = this.moveObservable.subscribe(this.onMove.bind(this));
    this.downSubscription = this.downObservable.subscribe(this.onDown.bind(this));
    this.upSubscription = this.upObservable.subscribe(this.onUp.bind(this));
    this.dimensionWatcher.subscribe(this.onResize.bind(this))
  }

  dispose() {
    this.moveSubscription?.unsubscribe();
    this.downSubscription?.unsubscribe();
    this.upSubscription?.unsubscribe();
  }

  subscribe(fnOrObserver: FnOrObserver): Subscription {
    return this.behaviorSubject.subscribe(fnOrObserver);
  }

  private onResize(dimensions: Vector2) {
    this.dimensions = dimensions;
  }

  private onMove(event: MouseEvent) {
    if (this.pressed) return;

    const origin = new Vector2(this.dom.offsetLeft, this.dom.offsetTop);
    const size = new Vector2(this.dom.clientWidth / 2, this.dom.clientHeight / 2);
    const translatedPosition = new Vector2((event.x - origin.x) - size.x, (event.y - origin.y) - size.y);

    this.dimensions = new Vector2(translatedPosition.x / size.x, translatedPosition.y / size.y);
    this.behaviorSubject.next(this.dimensions);
  }

  private onDown(_event: MouseEvent) {
    this.pressed = true;
  }

  private onUp(_event: MouseEvent) {
    this.pressed = false;
  }
}