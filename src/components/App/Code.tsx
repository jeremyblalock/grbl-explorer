import React, { useState, useCallback } from 'react'
import classNames from 'classnames'
import { File, Line, Clause } from '../../utils/types'
import { getLineNumberWidth } from '../../utils/text'

import styles from './Code.module.css'

type HoverFunc = (id: string, leaving?: boolean) => void

interface CodeProps {
  file: File
}

interface LineProps {
  line: Line
  onHover: HoverFunc
  hover: string | null
}

interface ExtendedLineProps extends LineProps {
  lineNumberWidth: number
}

interface ClauseProps {
  clause: Clause
  onHover: HoverFunc
  hover: string | null
}

const ClauseItem: React.FC<ClauseProps> = function ClauseItem({
  clause,
  onHover,
  hover,
}) {
  const hovered = hover === clause.id

  const handleMouseEnter = useCallback(() => {
    onHover(clause.id)
  }, [clause.id, onHover])

  const handleMouseLeave = useCallback(() => {
    onHover(clause.id, true)
  }, [clause.id, onHover])

  return (
    <span
      className={classNames(
        styles.clause,
        styles[clause.type],
        clause.mode && styles[clause.mode],
        clause.unit && styles[clause.unit],
        hovered && styles.hovered
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {clause.text}
    </span>
  )
}

const ClauseDescription: React.FC<ClauseProps> = function ClauseDescription({
  clause,
  onHover,
  hover,
}) {
  const hovered = hover === clause.id
  const partialDescription = clause.name || clause.description || 'Unknown'

  const description =
    partialDescription.slice(-1) === '.'
      ? partialDescription
      : `${partialDescription}.`

  const handleMouseEnter = useCallback(() => {
    onHover(clause.id)
  }, [clause.id, onHover])

  const handleMouseLeave = useCallback(() => {
    onHover(clause.id, true)
  }, [clause.id, onHover])

  return (
    <>
      <span
        className={classNames(
          styles.clauseDescription,
          styles[clause.type],
          clause.mode && styles[clause.mode],
          clause.unit && styles[clause.unit],
          hovered && styles.hovered
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {description}
      </span>{' '}
    </>
  )
}

const LineItem: React.FC<LineProps> = function LineItem({
  line,
  onHover,
  hover,
}) {
  return (
    <div className={styles.line}>
      {line.clauses.map((clause, index) => (
        <ClauseItem
          key={index}
          clause={clause}
          onHover={onHover}
          hover={hover}
        />
      ))}
    </div>
  )
}

const LineDescription: React.FC<LineProps> = function LineDescription({
  line,
  onHover,
  hover,
}) {
  const commands = line.clauses.filter(clause =>
    ['command', 'directive'].includes(clause.type)
  )

  return (
    <div className={styles.lineDescription}>
      {commands.map((command, index) => (
        <ClauseDescription
          key={index}
          clause={command}
          onHover={onHover}
          hover={hover}
        />
      ))}
    </div>
  )
}

const CombinedLine: React.FC<ExtendedLineProps> = function CombinedLine({
  line,
  lineNumberWidth,
  onHover,
  hover,
}) {
  return (
    <div className={styles.combinedLine}>
      <span className={styles.lineNumber} style={{ width: lineNumberWidth }}>
        {line.lineNumber}
      </span>
      <LineItem line={line} onHover={onHover} hover={hover} />
      <LineDescription line={line} onHover={onHover} hover={hover} />
    </div>
  )
}

const Code: React.FC<CodeProps> = ({ file }) => {
  const [hover, setHover] = useState<string | null>(null)
  const lineNumberWidth = getLineNumberWidth(file.lines.length)

  const handleSetHover = useCallback<HoverFunc>(
    (id: string, leaving = false) => {
      if (leaving && hover === id) {
        setHover(null)
      } else {
        setHover(id)
      }
    },
    [setHover, hover]
  )

  return (
    <div className={styles.wrapper}>
      {file.lines.map(line => (
        <CombinedLine
          onHover={handleSetHover}
          key={line.lineNumber}
          line={line}
          lineNumberWidth={lineNumberWidth}
          hover={hover}
        />
      ))}
    </div>
  )
}

export default Code
