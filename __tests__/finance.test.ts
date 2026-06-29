import { parcelaMes, totReceitas, totFixos, totComprasMes, saldoMes, diasParaVencer } from '../finance'
import type { Compra, Receita, DespesaFixa } from '../types'

const compraBase: Compra = {
  id: 1,
  descricao: 'Compra teste',
  valor: 300,
  parcelas: 3,
  parcelaAtual: 10, // dia da compra
  mes: 1,
  ano: 2025,
  cartaoId: 1,
}

describe('parcelaMes', () => {
  // fechamento dia 15; compra no dia 10 (antes do fechamento) → conta no mesmo mês
  test('parcela no mês da compra quando dia < fechamento', () => {
    expect(parcelaMes(compraBase, 15, 1, 2025)).toBeCloseTo(100)
  })

  test('parcela no mês seguinte quando dia > fechamento', () => {
    // parcelaAtual=20 (após fechamento=15) → offset 1 mês
    const compra: Compra = { ...compraBase, parcelaAtual: 20 }
    expect(parcelaMes(compra, 15, 1, 2025)).toBe(0)
    expect(parcelaMes(compra, 15, 2, 2025)).toBeCloseTo(100)
  })

  test('retorna 0 fora do intervalo de parcelas', () => {
    expect(parcelaMes(compraBase, 15, 4, 2025)).toBe(0)
  })
})

describe('totReceitas', () => {
  const receitas: Receita[] = [
    { id: 1, descricao: 'Salário', valor: 5000, mes: 1, ano: 2025 },
    { id: 2, descricao: 'Freelance', valor: 1000, mes: 1, ano: 2025 },
    { id: 3, descricao: 'Outro mês', valor: 999, mes: 2, ano: 2025 },
  ]

  test('soma receitas do mês correto', () => {
    expect(totReceitas(receitas, 1, 2025)).toBe(6000)
  })

  test('ignora receitas de outros meses', () => {
    expect(totReceitas(receitas, 3, 2025)).toBe(0)
  })
})

describe('saldoMes', () => {
  const receitas: Receita[] = [{ id: 1, descricao: 'Salário', valor: 5000, mes: 1, ano: 2025 }]
  const fixos: DespesaFixa[] = [{ id: 1, descricao: 'Aluguel', valor: 2000, dia: 5 }]

  test('saldo = receitas - fixos - compras', () => {
    const saldo = saldoMes(receitas, fixos, [compraBase], [{ id: 1, fechamento: 15 }], 1, 2025)
    expect(saldo).toBeCloseTo(5000 - 2000 - 100)
  })
})

describe('diasParaVencer', () => {
  test('fechamento no futuro do mês atual', () => {
    const hoje = new Date(2025, 0, 10) // 10/01/2025
    expect(diasParaVencer(20, hoje)).toBe(10)
  })

  test('fechamento já passou — conta para próximo mês', () => {
    const hoje = new Date(2025, 0, 20) // 20/01/2025
    const dias = diasParaVencer(5, hoje)
    expect(dias).toBeGreaterThan(0)
    // próximo fechamento: 05/02/2025 → 16 dias
    expect(dias).toBe(16)
  })
})
