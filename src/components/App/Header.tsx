import React, { useCallback } from 'react'
import { File } from '../../utils/types'
import styles from './Header.module.css'

interface HeaderProps {
  loadFile: () => void
  clearFile: () => void
  file?: File
}

const Header: React.FC<HeaderProps> = function Header({
  file,
  loadFile,
  clearFile,
}) {
  const handleClear = useCallback(() => {
    if (!window.confirm('Are you sure you want to clear the file?')) return

    clearFile()
  }, [clearFile])

  return (
    <header className={styles.wrapper}>
      <div className={styles.brand}>
        <h1 className={styles.title}>GRBL Explorer</h1>
      </div>
      {file && (
        <nav className={styles.nav}>
          <span className={styles.filename}>
            {file ? file.filename : 'No File'}
          </span>
          <button onClick={handleClear} className={styles.clear}>
            X
          </button>
          <button onClick={loadFile} type="button" className={styles.load}>
            Load Another File
          </button>
        </nav>
      )}
      <div className={styles.attribution}>
        <span>Built by Jeremy Blalock</span>
        <span className={styles.spacer}>•</span>
        <a
          className={styles.github}
          href="https://github.com/jeremyblalock/grbl-explorer"
          target="_blank"
          rel="nofollow noreferrer"
        >
          Github Repository
        </a>
      </div>
    </header>
  )
}

export default Header
