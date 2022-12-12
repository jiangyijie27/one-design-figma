import "./App.css"

function App() {
  const handleExport = () => {
    parent.postMessage({ pluginMessage: { type: "export" } }, "*")
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleExport}>导出 Token</button>
      </header>
    </div>
  )
}

export default App
