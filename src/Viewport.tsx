import { useContext, useEffect } from "react";
import { SettingsContext } from "./contexts/settings-context";

export function Viewport() {
  const settings = useContext(SettingsContext);

  useEffect(() => {
    const example = settings.example;
    console.log(`Load ${example}`);

    return () => {
      console.log(`Clean up ${example}`);
    };
  }, [settings.example]);

  return <div className="w-full h-full overflow-scroll">Viewport</div>;
}