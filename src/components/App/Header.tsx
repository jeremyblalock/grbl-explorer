import React, { useCallback } from 'react'
import styles from './Header.module.css'

interface HeaderProps {
  setFile: (file: string) => void
}

const Header: React.FC<HeaderProps> = function Header({ setFile }) {
  const handleClear = useCallback(() => {
    if (!window.confirm('Are you sure you want to clear the file?')) return

    setFile('')
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
          setFile(result)
        }
      }
    }

    input.click()
  }, [])

  return (
    <header className={styles.wrapper}>
      <button onClick={handleLoadFile} type="button">
        Open File
      </button>
      <button onClick={handleClear}>Clear</button>
    </header>
  )
}

export default Header
