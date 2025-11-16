import { createContext, useState } from "react";
import type { GLTF } from "three/examples/jsm/Addons.js"

type ExampleShape = {
  title: string,
  description: string,
  libraryPath: string,
  library?: GLTF;
}

type ExampleContextShape = {
  examples: ExampleShape[],
  addExample: (example: ExampleShape) => void,
  defineLibraryForPath: (path: string, library: GLTF) => void,
};

export const ExampleContext = createContext<ExampleContextShape>({
  addExample: () => {},
  defineLibraryForPath: (path: string, library: GLTF) => {},
  examples: [],
});

export function ExampleProvider({
  children,
}: { children: any }) {
  const [examples, setExamples] = useState<ExampleShape[]>([]);
  const addExample = (example: ExampleShape) => {
    setExamples((ex) => {
      return [...ex, example];
    });
  };
  const defineLibraryForPath = (path: string, library: GLTF) => {
    setExamples((examples) => {
      return examples.map(ex => {
        if (ex.libraryPath === path) {
          return { ...ex, library };
        } else {
          return ex;
        }
      });
    });
  };

  return <ExampleContext value={{ examples, addExample, defineLibraryForPath }}>{ children }</ExampleContext>;
}