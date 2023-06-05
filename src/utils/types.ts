export type ClauseType = 'comment' | 'command'

export interface Clause {
  type: ClauseType
  text: string
}

export interface Line {
  clauses: Clause[]
  lineNumber: number
}

export type File = Line[]
