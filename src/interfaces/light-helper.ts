import type { Scene } from "three";

export interface LightHelper {
  setup(scene: Scene): void;
}