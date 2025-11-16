import { createContext, useCallback, useState } from "react"

type SettingsShape = {
  example: string | null,
}

type ContextUpdateShape = {
  update: (name: keyof SettingsShape, value: any) => void,
};

export const SettingsContext = createContext<SettingsShape & ContextUpdateShape>({
  update: () => {},
  example: null,
});

export function SettingsProvider({
  children,
}: { children: any }) {
  const [settings, updateSettings] = useState<SettingsShape>({
    example: null,
  });
  const update = useCallback((name: keyof SettingsShape, value: any) => {
    updateSettings((s) => {
      return {
        ...s,
        [name]: value,
      };
    });
  }, [updateSettings]);

  return <SettingsContext value={ { ...settings, update } }>{ children }</SettingsContext>;
}