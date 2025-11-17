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
    id: 'metal-cube',
    title: 'Metal Cube',
    description: 'A metal cube with some extrusions.',
    libraryPath: '/experiments/materials-test/metal-cube.glb',
  }
];