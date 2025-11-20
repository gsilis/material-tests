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
    libraryPath: '/metal-cube.glb',
  }
];