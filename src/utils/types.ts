export type ClauseType =
  | 'comment'
  | 'parameter'
  | 'command'
  | 'directive'
  | 'unknown'

export interface Clause {
  id: string
  type: ClauseType
  text: string
  name?: string
  description?: string
}

export interface Line {
  clauses: Clause[]
  lineNumber: number
}

export interface File {
  lines: Line[]
  filename: string
}
