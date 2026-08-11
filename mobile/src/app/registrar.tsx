import { useEffect, useMemo, useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Stepper } from '@/ui/Stepper'
import { colors, radius, space } from '@/ui/theme'
import { db } from '@/db/instance'
import { buildAtendimento, hasItems, type QtyMap } from '@/features/registrar/buildAtendimento'
import type { Cliente, Produto, Servico, StatusAtendimento } from '@/types/api'

const brl = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

function enderecoResumo(c: Cliente): string {
  const rua = c.logradouro ? `${c.logradouro}${c.numero ? ', ' + c.numero : ''}` : ''
  const local = c.bairro ?? c.cidade ?? ''
  return [rua, local].filter(Boolean).join(' — ')
}

export default function Registrar() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])

  const [clienteId, setClienteId] = useState<number | undefined>(undefined)
  const [servicoQty, setServicoQty] = useState<QtyMap>({})
  const [produtoQty, setProdutoQty] = useState<QtyMap>({})
  const [status, setStatus] = useState<StatusAtendimento>('Concluido')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      setClientes(await db.getClientes())
      setProdutos(await db.getProdutos())
      setServicos(await db.getServicos())
    })()
  }, [])

  const estimate = useMemo(() => {
    const s = servicos.reduce((acc, sv) => acc + (servicoQty[sv.id] || 0) * (sv.valorHora ?? sv.valorEmpreitada ?? 0), 0)
    const p = produtos.reduce((acc, pr) => acc + (produtoQty[pr.id] || 0) * pr.preco, 0)
    return s + p
  }, [servicos, produtos, servicoQty, produtoQty])

  const podeSalvar = clienteId !== undefined && hasItems(servicoQty, produtoQty) && !saving

  async function salvar() {
    if (clienteId === undefined) return
    setSaving(true)
    try {
      await db.addAtendimento(buildAtendimento({ clienteId, status, servicoQty, produtoQty }))
      router.back()
    } finally {
      setSaving(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Fechar" style={styles.close}>
          <Ionicons name="close" size={22} color={colors.ink2} />
        </Pressable>
        <Text style={styles.title}>Registrar atendimento</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {/* Cliente */}
        <Text style={styles.label}>Cliente</Text>
        <View style={{ gap: space(2) }}>
          {clientes.map((c) => {
            const on = c.id === clienteId
            return (
              <Pressable
                key={c.id}
                onPress={() => setClienteId(c.id)}
                style={[styles.row, on && styles.rowOn]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowTitle, on && { color: colors.brandInk }]}>{c.nome}</Text>
                  {enderecoResumo(c) ? <Text style={styles.rowSub}>{enderecoResumo(c)}</Text> : null}
                </View>
                <Ionicons
                  name={on ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={on ? colors.brand : colors.ink4}
                />
              </Pressable>
            )
          })}
        </View>

        {/* Serviços */}
        <Text style={styles.label}>Serviços</Text>
        <View style={{ gap: space(2) }}>
          {servicos.map((sv) => (
            <View key={sv.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{sv.descricao}</Text>
                <Text style={styles.rowSub}>{brl(sv.valorHora ?? sv.valorEmpreitada ?? 0)}</Text>
              </View>
              <Stepper value={servicoQty[sv.id] || 0} onChange={(v) => setServicoQty((m) => ({ ...m, [sv.id]: v }))} />
            </View>
          ))}
        </View>

        {/* Produtos */}
        <Text style={styles.label}>Produtos</Text>
        <View style={{ gap: space(2) }}>
          {produtos.map((p) => (
            <View key={p.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{p.nome}</Text>
                <Text style={styles.rowSub}>
                  {brl(p.preco)} · {p.quantidadeEstoque} em estoque
                </Text>
              </View>
              <Stepper value={produtoQty[p.id] || 0} onChange={(v) => setProdutoQty((m) => ({ ...m, [p.id]: v }))} />
            </View>
          ))}
        </View>

        {/* Status */}
        <Text style={styles.label}>Status</Text>
        <View style={styles.seg}>
          {(['Concluido', 'Pendente'] as StatusAtendimento[]).map((s) => (
            <Pressable
              key={s}
              onPress={() => setStatus(s)}
              style={[styles.segBtn, status === s && styles.segBtnOn]}
            >
              <Text style={[styles.segText, status === s && styles.segTextOn]}>
                {s === 'Concluido' ? 'Concluído' : 'Pendente'}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.estimate}>
          <Text style={styles.estLabel}>Estimado</Text>
          <Text style={styles.estValue}>{brl(estimate)}</Text>
        </View>
        <Pressable
          onPress={salvar}
          disabled={!podeSalvar}
          style={({ pressed }) => [styles.save, (!podeSalvar || pressed) && { opacity: 0.6 }]}
        >
          <Text style={styles.saveText}>{saving ? 'Salvando…' : 'Salvar atendimento'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(3),
    paddingHorizontal: space(4),
    paddingVertical: space(3.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.line2,
    backgroundColor: colors.surface,
  },
  close: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: colors.ink },

  body: { padding: space(4), gap: space(2.5), paddingBottom: space(6) },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: colors.ink4, marginTop: space(2) },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(3),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: space(3.5),
  },
  rowOn: { borderColor: colors.brand, backgroundColor: colors.brandSoft },
  rowTitle: { fontSize: 15, fontWeight: '600', color: colors.ink },
  rowSub: { fontSize: 12.5, color: colors.ink3, marginTop: 2 },

  seg: { flexDirection: 'row', backgroundColor: colors.surface2, borderRadius: radius.sm, padding: 3, gap: 3 },
  segBtn: { flex: 1, paddingVertical: space(2.5), borderRadius: radius.sm - 3, alignItems: 'center' },
  segBtnOn: { backgroundColor: colors.surface },
  segText: { fontSize: 13.5, fontWeight: '600', color: colors.ink3 },
  segTextOn: { color: colors.ink },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(3),
    padding: space(4),
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.surface,
  },
  estimate: { flex: 0 },
  estLabel: { fontSize: 11, color: colors.ink4, textTransform: 'uppercase', letterSpacing: 0.5 },
  estValue: { fontSize: 18, fontWeight: '700', color: colors.ink },
  save: { flex: 1, backgroundColor: colors.brand, borderRadius: radius.sm, paddingVertical: space(3.75), alignItems: 'center' },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '700' },
})
