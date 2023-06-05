import { File, Line, ClauseType } from './types'

type LexemeType = ClauseType
type Lexeme = [string, LexemeType?]

const INLINE_COMMENT = /\(.*\)/g
const END_LINE_COMMENT = /;.*/g

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
  const grouped = parts.map(part => lexSub(part, pattern, patternName))

  return grouped.flat()
}

const parseLine = (raw: string, lineNumber: number): Line => {
  let parts: Lexeme[] = lex([[raw]], INLINE_COMMENT, 'comment')
  parts = lex(parts, END_LINE_COMMENT, 'comment')

  const clauses = parts.map(part => ({
    type: part[1] || 'command',
    text: part[0],
  }))

  return { clauses, lineNumber }
}

export const parseFile = (raw: string): File => {
  const rawLines = raw.split('\n')
  const lines = rawLines.map(parseLine)

  return lines
}
