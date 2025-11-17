type MenuItemData = {
  title: string,
  description: string,
  select: () => void,
  selected: boolean,
};

export function MenuItem({
  title,
  description,
  select,
  selected,
}: MenuItemData) {
  const classes: string[] = [
    'text-sky-300',
    'rounded-md',
    'transition-all',
    'duration-200',
    'hover:bg-sky-500/20',
    'm-2',
    'px-2',
    'py-1',
    'my-1',
    'cursor-pointer',
    'border-1',
    'border-transparent',
    'hover:border-sky-500/30',
  ];

  if (selected) {
    classes.push('bg-sky-600/10');
  }

  return <div className={ classes.join(' ') } onClick={ select }>
    <p className="text-md">{ title }</p>
    <p className="text-xs">{ description }</p>
  </div>;
}