export interface Receita {
  id: number
  descricao: string
  valor: number
  mes: number
  ano: number
}

export interface DespesaFixa {
  id: number
  descricao: string
  valor: number
  dia: number
}

export interface Cartao {
  id: number
  nome: string
  fechamento: number
  limite?: number
}

export interface Compra {
  id: number
  descricao: string
  valor: number
  parcelas: number
  parcelaAtual: number
  mes: number
  ano: number
  cartaoId: number
}

export interface Meta {
  id: number
  descricao: string
  valor: number
  valorAtual: number
}

export interface EstadoTemporal {
  mesRef: number
  anoRef: number
}

export type nid = number
