import React, { useCallback, useState } from 'react'
import { File } from '../../utils/types'
import { parseFile } from '../../utils/parsing'
import Header from './Header'
import Code from './Code'
import EmptyState from './EmptyState'
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

  const handleLoadFile = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.nc'

    input.onchange = (event: any) => {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.readAsText(file)

      reader.onload = () => {
        const result = reader.result

        if (typeof result !== 'string') {
          alert('We could not process the file you uploaded')
        } else {
          handleSetFile(file.name, result)
        }
      }
    }

    input.click()
  }, [handleSetFile])

  return (
    <div className="App">
      <Header loadFile={handleLoadFile} file={file} clearFile={handleClear} />
      {file ? <Code file={file} /> : <EmptyState loadFile={handleLoadFile} />}
    </div>
  )
}

export default App
