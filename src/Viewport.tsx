import { useContext, useEffect, useMemo, useRef } from "react";
import { SettingsContext } from "./contexts/settings-context";
import { Player } from "./player";
import { ExampleContext } from "./contexts/examples-context";

export function Viewport() {
  const settings = useContext(SettingsContext);
  const examples = useContext(ExampleContext);
  const viewport = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);
  const player = useMemo(() => {
    return new Player();
  }, []);

  useEffect(() => {
    const exampleId = settings.example || '';
    const example = examples.findExample(exampleId);

    if (!example) {
      return;
    }

    player.load(example);

    return () => {
      player.unload();
    };
  }, [settings.example, examples.findExample, player]);
  useEffect(() => {
    if (initialized.current || !viewport.current) {
      return;
    }

    initialized.current = true;
    player.attach(viewport.current);
  }, [viewport.current, initialized.current]);

  return <div ref={ viewport } className="w-full h-full overflow-scroll"></div>;
}