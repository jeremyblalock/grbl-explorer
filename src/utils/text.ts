const cache: { [len: string]: number } = {}

export const measureMonospace = (textLength: number, fontSize: number) => {
  const ctx = document.createElement('canvas').getContext('2d')

  if (!ctx) {
    return fontSize * textLength * 0.7
  }

  ctx.font = `${fontSize}px monospace`

  return ctx.measureText('0'.repeat(textLength)).width
}

export const getLineNumberWidth = (lineCount: number): number => {
  const numberLength = lineCount.toString().length + 1

  if (!cache[numberLength]) {
    cache[numberLength] = measureMonospace(numberLength, 16)
  }

  return cache[numberLength]
}
