import React from 'react'
import { File } from '../../utils/types'
import { parseFile } from '../../utils/parsing'
import Header from './Header'
import Code from './Code'
import './App.css'

function App() {
  const [file, setFile] = React.useState<File>()

  const handleSetFile = React.useCallback((file: string) => {
    const parsed = parseFile(file)

    setFile(parsed)
  }, [])

  return (
    <div className="App">
      <Header setFile={handleSetFile} />
      {file && <Code file={file} />}
    </div>
  )
}

export default App
