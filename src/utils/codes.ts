import data from '../assets/codes.json'

interface Code {
  codes: string[]
  description?: string
  name?: string
}

interface TypedCode extends Code {
  type: 'command' | 'parameter' | 'directive'
}

type OptionalCode = TypedCode | null

type Index = { [key: string]: Code }

export const commands: Index = {}
export const directives: Index = {}
export const parameters: Index = {}

for (const itm of data.commands) {
  for (const code of itm.codes) {
    commands[code] = itm
  }
}

for (const itm of data.directives) {
  for (const code of itm.codes) {
    directives[code] = itm
  }
}

for (const itm of data.parameters) {
  for (const code of itm.codes) {
    parameters[code] = itm
  }
}

export const parseCode = (code: string): OptionalCode => {
  // First parse as code
  if (commands[code]) {
    return {
      type: 'command',
      ...commands[code],
    }
  }

  const paramName = code.substring(0, 1)

  // Then parse as directive
  const directive = directives[paramName]

  if (directive) {
    return {
      type: 'directive',
      ...directive,
    }
  }

  // Then parse as parameter
  const param = parameters[paramName]

  if (param) {
    return {
      type: 'parameter',
      ...param,
    }
  }

  return null
}
