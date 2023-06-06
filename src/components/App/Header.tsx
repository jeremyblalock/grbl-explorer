import React, { useCallback } from 'react'
import { File } from '../../utils/types'
import styles from './Header.module.css'

interface HeaderProps {
  setFile: (filename: string, file: string) => void
  clearFile: () => void
  file?: File
}

const Header: React.FC<HeaderProps> = function Header({
  file,
  setFile,
  clearFile,
}) {
  const handleClear = useCallback(() => {
    if (!window.confirm('Are you sure you want to clear the file?')) return

    clearFile()
  }, [clearFile])

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
          setFile(file.name, result)
        }
      }
    }

    input.click()
  }, [])

  return (
    <header className={styles.wrapper}>
      <h1 className={styles.title}>GRBL Exploerer</h1>
      <div className={styles.spacer} />
      <nav className={styles.nav}>
        <span className={styles.filename}>
          {file ? file.filename : 'No File'}
        </span>
        <button onClick={handleLoadFile} type="button">
          Open File
        </button>
        <button onClick={handleClear}>Clear</button>
      </nav>
    </header>
  )
}

export default Header
