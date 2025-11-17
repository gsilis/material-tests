import { fromEvent, Observable, Subscription } from "rxjs";
import { Vector3, type PerspectiveCamera } from "three";

export class ControlsManager {
  private camera: PerspectiveCamera;
  private dom: HTMLElement;
  private _mouseMove: boolean = true;
  private _mouseMoveObserver: Observable<MouseEvent>;
  private _mouseMoveSubscription?: Subscription;
  private _down: boolean = false;

  constructor(camera: PerspectiveCamera, dom: HTMLElement) {
    this.camera = camera;
    this.dom = dom;
    this._mouseMoveObserver = fromEvent<MouseEvent>(this.dom, 'mousemove');

    if (this._mouseMove) {
      this._mouseMoveSubscription = this._mouseMoveObserver.subscribe(this.onMouseMove.bind(this));
    }
  }

  get mouseMove() {
    return this._mouseMove;
  }

  set mouseMove(value: boolean) {
    this._mouseMove = value;
  }

  private onMouseMove(event: MouseEvent) {
    if (this._down) return;

    const clientY = event.clientY - this.dom.offsetTop;
    const clientX = event.clientX - this.dom.offsetLeft;
    const width = this.dom.clientWidth;
    const height = this.dom.clientHeight;

    const x = -((clientX) - (width / 2)) / 300;
    const y = -((clientY) - (height / 2)) / 300;

    this.camera.position.set(x, y, this.camera.position.z);
    this.camera.lookAt(new Vector3(0, 0, 0));
  }

  teardown() {
    this._mouseMoveSubscription && this._mouseMoveSubscription.unsubscribe();
  }
}