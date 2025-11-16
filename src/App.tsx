import './App.css'

function App() {
  return <div className="flex flex-row h-screen">
    <div className="picker absolute sm:static flex-0 sm:flex-[0_200px] bg-sky-950">
      Picker
    </div>
    <div className="viewport flex-1 bg-sky-900">
      Viewport
    </div>
  </div>;
}

export default App
