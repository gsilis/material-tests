export type Example = {
  id: string,
  title: string,
  description: string,
  libraryPath: string,
}

export const examples: Example[] = [
  {
    id: 'metal-cube',
    title: 'Metal Cube',
    description: 'A metal cube with some extrusions.',
    libraryPath: './metal-cube.glb',
  },
  {
    id: 'brick-cube',
    title: 'Brick Cube',
    description: 'A brick cube with an attempt at applying a normals map.',
    libraryPath: './brick-cube.glb',
  }
];