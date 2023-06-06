import shortUUID from 'short-uuid'
import { Line, Clause, ClauseType } from './types'
import { parseCode } from './codes'

type LexemeType = ClauseType
type Lexeme = [string, LexemeType?]

const INLINE_COMMENT = /\(.*\)/g
const END_LINE_COMMENT = /;.*/g
const COMMAND = /[A-Z]\-?\d+(\.\d+)?/g

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

export const parseFile = (raw: string): Line[] => {
  const rawLines = raw.split('\n')
  const lines = rawLines.map(parseLine)

  return lines
}
