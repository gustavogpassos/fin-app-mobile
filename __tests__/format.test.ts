import { formatCurrency, formatDate } from '../format'

describe('formatCurrency', () => {
  test('formata valor em BRL pt-BR', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56')
  })

  test('formata zero', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00')
  })
})

describe('formatDate', () => {
  test('formata data em dd/MM/yyyy', () => {
    expect(formatDate(new Date(2025, 0, 15))).toBe('15/01/2025')
  })

  test('formata data com padding', () => {
    expect(formatDate(new Date(2025, 2, 5))).toBe('05/03/2025')
  })
})
