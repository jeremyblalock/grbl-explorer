import React from 'react'
import classNames from 'classnames'
import { File, Line, Clause } from '../../utils/types'

import styles from './Code.module.css'

interface CodeProps {
  file: File
}

interface LineProps {
  line: Line
}

interface ClauseProps {
  clause: Clause
}

const ClauseItem: React.FC<ClauseProps> = function ClauseItem({ clause }) {
  return (
    <span className={classNames(styles.clause, styles[clause.type])}>
      {clause.text}
    </span>
  )
}

const LineItem: React.FC<LineProps> = function LineItem({ line }) {
  return (
    <div className={styles.line}>
      {line.clauses.map((clause, index) => (
        <ClauseItem key={index} clause={clause} />
      ))}
    </div>
  )
}

const Code: React.FC<CodeProps> = ({ file }) => {
  return (
    <div className={styles.wrapper}>
      {file.map(line => (
        <LineItem key={line.lineNumber} line={line} />
      ))}
    </div>
  )
}

export default Code
