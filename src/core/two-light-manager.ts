import { DirectionalLight, type Scene } from "three";
import type { LightHelper } from "../interfaces/light-helper";

export class TwoLightManager implements LightHelper {
  private scene?: Scene;
  private directionalLight = new DirectionalLight(0xFFFFFF, 10);
  private directionalLightBottom = new DirectionalLight(0x0FFFFFF, 5);

  constructor() {
    this.directionalLight.position.set(2, 5, 5);
    this.directionalLight.target.position.set(0, 0, 0);
    this.directionalLightBottom.position.set(-1, -2, -5);
    this.directionalLightBottom.target.position.set(0, 0, 0);
  }

  setup(scene: Scene) {
    this.scene = scene;
    this.scene.add(this.directionalLight);
    this.scene.add(this.directionalLightBottom);
  }
}