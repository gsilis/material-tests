import type { PerspectiveCamera, Vector2, Vector3 } from "three";
import type { MouseWatcher } from "./mouse-watcher";
import type { Subscription } from "rxjs";

export class PercentageCameraController {
  private camera: PerspectiveCamera;
  private mouseWatcher: MouseWatcher;
  private cameraPosition: Vector3;
  private mouseWatcherSubscription: Subscription;
  private range: number;

  constructor(camera: PerspectiveCamera, mouseWatcher: MouseWatcher, range: number) {
    this.camera = camera;
    this.mouseWatcher = mouseWatcher;
    this.cameraPosition = this.camera.position.clone();
    this.mouseWatcherSubscription = this.mouseWatcher.subscribe(this.onMove.bind(this));
    this.range = range;
  }

  dispose() {
    this.mouseWatcherSubscription.unsubscribe();
  }

  private onMove(vector: Vector2) {
    this.camera.position.set(
      this.cameraPosition.x + (vector.x * this.range),
      this.cameraPosition.y + (vector.y * this.range),
      this.cameraPosition.z,
    );
    this.camera.lookAt(0, 0, 0);
  }
}