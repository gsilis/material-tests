import { useContext, useEffect, useMemo, useRef } from "react";
import { SettingsContext } from "./contexts/settings-context";
import { Player } from "./player";

export function Viewport() {
  const settings = useContext(SettingsContext);
  const viewport = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);
  const player = useMemo(() => {
    return new Player();
  }, []);

  useEffect(() => {
    const example = settings.example;
    console.log(`Load ${example}`);

    return () => {
      console.log(`Clean up ${example}`);
    };
  }, [settings.example]);
  useEffect(() => {
    if (initialized.current || !viewport.current) {
      return;
    }

    initialized.current = true;
    player.attach(viewport.current);
  }, [viewport.current, initialized.current]);

  return <div ref={ viewport } className="w-full h-full overflow-scroll">Viewport</div>;
}