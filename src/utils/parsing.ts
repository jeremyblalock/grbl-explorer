import shortUUID from 'short-uuid'
import { parseCode } from './codes'

import type { Line, Clause, ClauseType, Unit, Mode } from './types'

type LexemeType = ClauseType
type Lexeme = [string, LexemeType?]

const INLINE_COMMENT = /\(.*\)/g
const END_LINE_COMMENT = /;.*/g
const COMMAND = /[A-Z]\-?\d+(\.\d+)?/g

const ABSOLUTE_CODE = 'G90'
const RELATIVE_CODE = 'G91'

const ABSOLUTE = 'absolute'
const RELATIVE = 'relative'

const MM_CODE = 'G21'
const INCH_CODE = 'G20'

const MM = 'mm'
const INCH = 'inch'

const lexSub = (
  baseLexeme: Lexeme,
  pattern: RegExp,
  patternName?: LexemeType
): Lexeme[] => {
  const [text, baseType] = baseLexeme

  const results: Lexeme[] = []
  let index = 0

  for (const match of text.matchAll(pattern)) {
    const start = match.index || 0
    const end = start + match[0].length

    if (start > index) {
      results.push([text.substring(index, start), baseType])
    }

    results.push([text.substring(start, end), patternName])
    index = end
  }

  if (index < text.length) {
    results.push([text.substring(index), baseType])
  }

  return results
}

const lex = (
  parts: Lexeme[],
  pattern: RegExp,
  patternName: LexemeType
): Lexeme[] => {
  const grouped = parts.map(part =>
    part[1] ? [part] : lexSub(part, pattern, patternName)
  )

  return grouped.flat()
}

const parseLine = (raw: string, rawLineNumber: number): Line => {
  let parts: Lexeme[] = lex([[raw]], INLINE_COMMENT, 'comment')
  parts = lex(parts, END_LINE_COMMENT, 'comment')
  parts = lex(parts, COMMAND, 'command')

  const clauses: Clause[] = parts
    .map(part => ({
      type: part[1] || 'unknown',
      text: part[0],
    }))
    .map(itm => {
      const id = shortUUID.generate()

      if (itm.type !== 'command') return { ...itm, id } as Clause

      const { text } = itm
      const parsed = parseCode(text)

      if (!parsed) {
        return {
          id,
          text,
          type: 'unknown',
        } as Clause
      }

      const { type: codeType, name, description } = parsed

      const result: Clause = {
        ...itm,
        id,
        type: codeType,
        name,
        description,
      }

      return result
    })

  return { clauses, lineNumber: rawLineNumber + 1 }
}

export const setCoordinates = (lines: Line[]): Line[] => {
  let unit: Unit | undefined
  let mode: Mode | undefined

  const result = lines.map(line => {
    const clauses = line.clauses.map(clause => {
      if (clause.type === 'command') {
        if (clause.text === ABSOLUTE_CODE) {
          mode = ABSOLUTE
        } else if (clause.text === RELATIVE_CODE) {
          mode = RELATIVE
        } else if (clause.text === MM_CODE) {
          unit = MM
        } else if (clause.text === INCH_CODE) {
          unit = INCH
        }
      }

      return { ...clause, unit, mode }
    })

    return {
      ...line,
      clauses,
    }
  })

  return result
}

export const parseFile = (raw: string): Line[] => {
  const rawLines = raw.split('\n')
  const lines = rawLines.map(parseLine)
  const post = setCoordinates(lines)

  return post
}
