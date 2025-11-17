import type { WebGLRenderer } from "three";

export interface ExampleScene {
  setup(): void;
  teardown(): void;
  render(): void;
}