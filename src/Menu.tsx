import { useContext, useState } from "react";
import { ExampleContext } from "./contexts/examples-context";
import { MenuItem } from "./MenuItem";
import { SettingsContext } from "./contexts/settings-context";

export function Menu() {
  const [open, setOpen] = useState(false);
  const examples = useContext(ExampleContext);
  const settings = useContext(SettingsContext);
  const selectedExample = settings.example;
  const onToggleMenu = () => {
    setOpen(o => !o);
  };
  const menuContentClasses: string[] = [
    'overflow-scroll',
    'no-scrollbars',
    'flex-1',
    'max-h-[400px]',
    'sm:max-h-full'
  ];
  if (open) {
    menuContentClasses.push('block');
  } else {
    menuContentClasses.push('hidden', 'sm:block');
  }

  return <div className="w-full h-full flex flex-col bg-sky-950 sm:bg-transparent">
    <button className="block sm:hidden flex-0 text-2xl px-2 py-1 text-sky-300 font-bold cursor-pointer leading-none rounded-md hover:bg-sky-600/10 border-b-1 border-sky-300/10" onClick={ onToggleMenu } title={ open ? 'Close menu' : 'Expand menu' }>
      { open ? '⌃' : '↓' }
    </button>
    <div className={ menuContentClasses.join(' ') }>
      { examples.examples.map((example) => {
        const selected = example.id === selectedExample;
        const select = function() {
          settings.update('example', example.id);
          setOpen(false);
        };

        return <MenuItem
          key={ example.id }
          title={ example.title }
          description={ example.description }
          select={ select }
          selected={ selected }
        ></MenuItem>;
      }) }
    </div>
  </div>;
}