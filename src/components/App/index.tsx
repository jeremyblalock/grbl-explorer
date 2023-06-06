import React, { useCallback, useState } from 'react'
import { File } from '../../utils/types'
import { parseFile } from '../../utils/parsing'
import Header from './Header'
import Code from './Code'
import './App.css'

function App() {
  const [file, setFile] = useState<File>()

  const handleSetFile = useCallback((filename: string, file: string) => {
    const parsed = parseFile(file)

    setFile({ lines: parsed, filename })
  }, [])

  const handleClear = useCallback(() => {
    setFile(undefined)
  }, [setFile])

  return (
    <div className="App">
      <Header setFile={handleSetFile} file={file} clearFile={handleClear} />
      {file && <Code file={file} />}
    </div>
  )
}

export default App
