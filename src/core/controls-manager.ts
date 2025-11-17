import { fromEvent, Observable, Subscription } from "rxjs";
import type { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export class ControlsManager {
  private camera: PerspectiveCamera;
  private dom: HTMLElement;
  private controls: OrbitControls;
  private _mouseMove: boolean = true;
  private _mouseObserver: Observable<MouseEvent>;
  private _mouseSubscription?: Subscription;

  constructor(camera: PerspectiveCamera, dom: HTMLElement) {
    this.camera = camera;
    this.dom = dom;
    this.controls = new OrbitControls(this.camera, this.dom);
    this._mouseObserver = fromEvent<MouseEvent>(this.dom, 'mousemove');

    if (this._mouseMove) {
      this._mouseSubscription = this._mouseObserver.subscribe(this.onMouseMove.bind(this));
    }
  }

  get mouseMove() {
    return this._mouseMove;
  }

  set mouseMove(value: boolean) {
    this._mouseMove = value;
  }

  private onMouseMove(event: MouseEvent) {
    // console.log('Move', [event.clientX, event.clientY]);
  }
}