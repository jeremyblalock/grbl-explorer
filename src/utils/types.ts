export type Unit = 'mm' | 'inch'
export type Mode = 'absolute' | 'relative'

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
  unit?: Unit
  mode?: Mode
}

export interface Line {
  clauses: Clause[]
  lineNumber: number
}

export interface File {
  lines: Line[]
  filename: string
}
