import { createContext, useState } from "react";
import type { GLTF } from "three/examples/jsm/Addons.js"
import { examples as staticExamples, type Example } from "../examples";

type ExampleContextShape = {
  examples: Example[],
  addExample: (example: Example) => void,
  defineLibraryForPath: (path: string, library: GLTF) => void,
};

export const ExampleContext = createContext<ExampleContextShape>({
  addExample: () => {},
  defineLibraryForPath: (_path: string, _library: GLTF) => {},
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

  return <ExampleContext value={{ examples, addExample, defineLibraryForPath }}>{ children }</ExampleContext>;
}