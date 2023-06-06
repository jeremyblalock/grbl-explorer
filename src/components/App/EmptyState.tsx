import React from 'react'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  loadFile: () => void
}

const EmptyState: React.FC<EmptyStateProps> = function EmptyState({
  loadFile,
}) {
  return (
    <div className={styles.emptyState}>
      <h2>Welcome to GRBL Explorer</h2>
      <p className={styles.tagline}>
        Upload your GRBL .nc file to easily analyze & debug each command.
      </p>
      <button onClick={loadFile} type="button" className={styles.load}>
        Choose .nc File
      </button>
      <p className={styles.privacy}>
        We don’t store your file, it remains in your browser. See our{' '}
        <a href="/privacy.html" target="_blank">
          Privacy Policy
        </a>{' '}
        for details.
      </p>
    </div>
  )
}

export default EmptyState
