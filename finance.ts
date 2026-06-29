import { Receita, DespesaFixa, Compra } from './types'

/**
 * Retorna o valor da parcela de uma Compra para um dado mês/ano de referência,
 * considerando a regra de fechamento do cartão.
 *
 * Regra: se o dia da compra (mes/ano originais) é após o fechamento do cartão,
 * a primeira parcela só aparece no mês seguinte.
 */
export function parcelaMes(
  compra: Compra,
  fechamento: number,
  mesRef: number,
  anoRef: number,
): number {
  const { mes, ano, parcelas, parcelaAtual, valor } = compra

  // índice de meses desde a compra (0 = mesmo mês)
  const diffMeses = (anoRef - ano) * 12 + (mesRef - mes)

  // dia da compra em relação ao fechamento determina quando começa a cobrar
  const diaCompra = parcelaAtual
  const offset = diaCompra > fechamento ? 1 : 0

  const indiceParcela = diffMeses - offset

  if (indiceParcela < 0 || indiceParcela >= parcelas) return 0

  return valor / parcelas
}

export function totReceitas(receitas: Receita[], mes: number, ano: number): number {
  return receitas
    .filter((r) => r.mes === mes && r.ano === ano)
    .reduce((acc, r) => acc + r.valor, 0)
}

export function totFixos(fixos: DespesaFixa[]): number {
  return fixos.reduce((acc, f) => acc + f.valor, 0)
}

export function totComprasMes(
  compras: Compra[],
  cartoes: { id: number; fechamento: number }[],
  mes: number,
  ano: number,
): number {
  return compras.reduce((acc, compra) => {
    const cartao = cartoes.find((c) => c.id === compra.cartaoId)
    if (!cartao) return acc
    return acc + parcelaMes(compra, cartao.fechamento, mes, ano)
  }, 0)
}

export function saldoMes(
  receitas: Receita[],
  fixos: DespesaFixa[],
  compras: Compra[],
  cartoes: { id: number; fechamento: number }[],
  mes: number,
  ano: number,
): number {
  return (
    totReceitas(receitas, mes, ano) -
    totFixos(fixos) -
    totComprasMes(compras, cartoes, mes, ano)
  )
}

/**
 * Retorna quantos dias faltam para o próximo fechamento do cartão.
 * Considera o mês atual; se o fechamento já passou, conta para o próximo mês.
 */
export function diasParaVencer(fechamento: number, hoje: Date = new Date()): number {
  const diaHoje = hoje.getDate()
  const mesHoje = hoje.getMonth()
  const anoHoje = hoje.getFullYear()

  if (fechamento >= diaHoje) {
    const dataFechamento = new Date(anoHoje, mesHoje, fechamento)
    return Math.round((dataFechamento.getTime() - hoje.getTime()) / 86_400_000)
  }

  // fechamento já passou — contar para o próximo mês
  const proximoMes = mesHoje === 11 ? 0 : mesHoje + 1
  const proximoAno = mesHoje === 11 ? anoHoje + 1 : anoHoje
  const dataFechamento = new Date(proximoAno, proximoMes, fechamento)
  return Math.round((dataFechamento.getTime() - hoje.getTime()) / 86_400_000)
}
