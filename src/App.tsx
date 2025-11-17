import './App.css'
import { Menu } from './Menu';
import { Viewport } from './Viewport';

function App() {
  return <div className="flex flex-row h-screen">
    <div className="picker absolute w-auto h-auto sm:w-screen sm:h-screen sm:static flex-0 sm:flex-[0_350px] bg-slate-950">
      <Menu />
    </div>
    <div className="viewport flex-1 bg-slate-900">
      <Viewport />
    </div>
  </div>;
}

export default App
