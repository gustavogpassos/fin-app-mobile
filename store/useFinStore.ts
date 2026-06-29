import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { mmkvStorage } from './kvStorage'
import { saldoMes } from '../finance'
import type { Receita, DespesaFixa, Compra, Cartao, Meta } from '../types'

interface FinState {
  receitas: Receita[]
  fixos: DespesaFixa[]
  compras: Compra[]
  cartoes: Cartao[]
  metas: Meta[]
  mesRef: number
  anoRef: number
  nid: number

  // Receita
  addReceita: (r: Omit<Receita, 'id'>) => void
  updateReceita: (r: Receita) => void
  removeReceita: (id: number) => void
  receitasMes: (mes: number, ano: number) => Receita[]

  // DespesaFixa
  addFixo: (f: Omit<DespesaFixa, 'id'>) => void
  updateFixo: (f: DespesaFixa) => void
  removeFixo: (id: number) => void

  // Compra
  addCompra: (c: Omit<Compra, 'id'>) => void
  updateCompra: (c: Compra) => void
  removeCompra: (id: number) => void
  comprasPorCartaoMes: (cartaoId: number, mes: number, ano: number) => Compra[]

  // Cartao
  addCartao: (c: Omit<Cartao, 'id'>) => void
  updateCartao: (c: Cartao) => void
  removeCartao: (id: number) => void

  // Meta
  addMeta: (m: Omit<Meta, 'id'>) => void
  updateMeta: (m: Meta) => void
  removeMeta: (id: number) => void

  // Navegação temporal
  setMesRef: (mes: number) => void
  setAnoRef: (ano: number) => void

  // Seletores derivados
  saldoMesAtual: () => number
}

const now = new Date()

export const useFinStore = create<FinState>()(
  persist(
    (set, get) => ({
      receitas: [],
      fixos: [],
      compras: [],
      cartoes: [],
      metas: [],
      mesRef: now.getMonth() + 1,
      anoRef: now.getFullYear(),
      nid: 1,

      addReceita: (r) =>
        set((s) => ({ receitas: [...s.receitas, { ...r, id: s.nid }], nid: s.nid + 1 })),
      updateReceita: (r) =>
        set((s) => ({ receitas: s.receitas.map((x) => (x.id === r.id ? r : x)) })),
      removeReceita: (id) =>
        set((s) => ({ receitas: s.receitas.filter((x) => x.id !== id) })),
      receitasMes: (mes, ano) => get().receitas.filter((r) => r.mes === mes && r.ano === ano),

      addFixo: (f) =>
        set((s) => ({ fixos: [...s.fixos, { ...f, id: s.nid }], nid: s.nid + 1 })),
      updateFixo: (f) =>
        set((s) => ({ fixos: s.fixos.map((x) => (x.id === f.id ? f : x)) })),
      removeFixo: (id) =>
        set((s) => ({ fixos: s.fixos.filter((x) => x.id !== id) })),

      addCompra: (c) =>
        set((s) => ({ compras: [...s.compras, { ...c, id: s.nid }], nid: s.nid + 1 })),
      updateCompra: (c) =>
        set((s) => ({ compras: s.compras.map((x) => (x.id === c.id ? c : x)) })),
      removeCompra: (id) =>
        set((s) => ({ compras: s.compras.filter((x) => x.id !== id) })),
      comprasPorCartaoMes: (cartaoId, mes, ano) =>
        get().compras.filter((c) => c.cartaoId === cartaoId && c.mes === mes && c.ano === ano),

      addCartao: (c) =>
        set((s) => ({ cartoes: [...s.cartoes, { ...c, id: s.nid }], nid: s.nid + 1 })),
      updateCartao: (c) =>
        set((s) => ({ cartoes: s.cartoes.map((x) => (x.id === c.id ? c : x)) })),
      removeCartao: (id) =>
        set((s) => ({ cartoes: s.cartoes.filter((x) => x.id !== id) })),

      addMeta: (m) =>
        set((s) => ({ metas: [...s.metas, { ...m, id: s.nid }], nid: s.nid + 1 })),
      updateMeta: (m) =>
        set((s) => ({ metas: s.metas.map((x) => (x.id === m.id ? m : x)) })),
      removeMeta: (id) =>
        set((s) => ({ metas: s.metas.filter((x) => x.id !== id) })),

      setMesRef: (mes) => set({ mesRef: mes }),
      setAnoRef: (ano) => set({ anoRef: ano }),

      saldoMesAtual: () => {
        const { receitas, fixos, compras, cartoes, mesRef, anoRef } = get()
        return saldoMes(receitas, fixos, compras, cartoes, mesRef, anoRef)
      },
    }),
    {
      name: 'fin-store',
      storage: createJSONStorage(() => mmkvStorage),
      version: 1,
      migrate: (state, version) => {
        // ponytail: no migrations needed at v1 — add cases here as schema evolves
        return state as FinState
      },
    },
  ),
)
