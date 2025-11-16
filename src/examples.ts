import type { GLTF } from "three/examples/jsm/Addons.js";

export type Example = {
  id: string,
  title: string,
  description: string,
  libraryPath: string,
  library?: GLTF;
}

export const examples: Example[] = [
  {
    id: 'world-1',
    title: 'World One',
    description: 'Initial example!',
    libraryPath: '/assets/testing.gltf',
  }
];