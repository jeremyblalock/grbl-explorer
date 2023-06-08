import type { Line } from '../types'
import { setCoordinates } from '../parsing'

describe('setCoordinates', () => {
  test('basic', () => {
    const lines: Line[] = [
      {
        lineNumber: 1,
        clauses: [
          {
            id: '0',
            text: 'G90',
            type: 'command',
            description: 'Absolute programming',
          },
          {
            id: '1',
            text: 'G21',
            type: 'command',
            description: 'Millimeters',
          },
        ],
      },
    ]

    const result = setCoordinates(lines)

    expect(result.length).toBe(1)
    expect(result[0].clauses[0].mode).toEqual('absolute')
    expect(result[0].clauses[1].mode).toEqual('absolute')
    expect(result[0].clauses[0].unit).toBe(undefined)
    expect(result[0].clauses[1].unit).toEqual('mm')
  })

  test('multiple lines', () => {
    const lines: Line[] = [
      {
        lineNumber: 1,
        clauses: [
          {
            id: '0',
            text: 'G90',
            type: 'command',
            description: 'Absolute programming',
          },
          {
            id: '1',
            text: 'G21',
            type: 'command',
            description: 'Millimeters',
          },
        ],
      },
      {
        lineNumber: 2,
        clauses: [
          {
            id: '2',
            text: 'G0',
            type: 'command',
            description: 'Rapid move',
          },
          {
            id: '3',
            text: 'X0',
            type: 'parameter',
            name: 'X',
          },
        ],
      },
    ]

    const result = setCoordinates(lines)

    expect(result.length).toEqual(2)
    expect(result[1].clauses[1].mode).toEqual('absolute')
    expect(result[1].clauses[1].unit).toEqual('mm')
  })
})
