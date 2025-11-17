import { createContext, useState } from "react";
import type { GLTF } from "three/examples/jsm/Addons.js"
import { examples as staticExamples, type Example } from "../examples";

type ExampleContextShape = {
  examples: Example[],
  addExample: (example: Example) => void,
  defineLibraryForPath: (path: string, library: GLTF) => void,
  findExample: (exampleId: string) => Example | null,
};

export const ExampleContext = createContext<ExampleContextShape>({
  addExample: () => {},
  defineLibraryForPath: (_path: string, _library: GLTF) => {},
  findExample: (_exampleId: string): Example | null => null,
  examples: [],
});

export function ExampleProvider({
  children,
}: { children: any }) {
  const [examples, setExamples] = useState<Example[]>([ ...staticExamples ]);
  const addExample = (example: Example) => {
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
  const findExample = (exampleId: string): Example | null => {
    return examples.find(ex => ex.id === exampleId) || null;
  };

  return <ExampleContext value={{
    examples,
    addExample,
    defineLibraryForPath,
    findExample
  }}>{ children }</ExampleContext>;
}