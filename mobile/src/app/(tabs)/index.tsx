import { useEffect, useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Screen } from '@/ui/Screen'
import { colors, radius, space } from '@/ui/theme'
import { db } from '@/db/instance'

export default function Inicio() {
  const [counts, setCounts] = useState<{ c: number; p: number; s: number } | null>(null)

  useEffect(() => {
    ;(async () => {
      const [c, p, s] = await Promise.all([db.getClientes(), db.getProdutos(), db.getServicos()])
      setCounts({ c: c.length, p: p.length, s: s.length })
    })()
  }, [])

  return (
    <Screen>
      <View style={styles.top}>
        <View style={styles.biz}>
          <Text style={styles.bizMark}>A</Text>
        </View>
        <View>
          <Text style={styles.bizName}>Agesto</Text>
          <Text style={styles.bizSub}>Agente de campo</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Pressable
          style={({ pressed }) => [styles.register, pressed && { opacity: 0.9 }]}
          accessibilityRole="button"
        >
          <View style={styles.plus}>
            <Ionicons name="add" size={26} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rt}>Registrar atendimento</Text>
            <Text style={styles.rs}>Novo serviço, agora — em poucos toques</Text>
          </View>
        </Pressable>

        {counts && (
          <View style={styles.sync}>
            <Ionicons name="cloud-done-outline" size={16} color={colors.good} />
            <Text style={styles.syncText}>
              Sincronizado: {counts.c} clientes · {counts.p} produtos · {counts.s} serviços
            </Text>
          </View>
        )}

        <Text style={styles.note}>
          A agenda do dia e o fluxo de registro chegam nas próximas tarefas.
        </Text>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(3),
    paddingHorizontal: space(4.5),
    paddingVertical: space(3.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.line2,
  },
  biz: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  bizMark: { color: '#fff', fontWeight: '700', fontSize: 16 },
  bizName: { fontSize: 15, fontWeight: '600', color: colors.ink },
  bizSub: { fontSize: 12.5, color: colors.ink3, marginTop: 1 },

  body: { flex: 1, padding: space(4), gap: space(4) },
  register: { backgroundColor: colors.brand, borderRadius: radius.card, padding: space(5), flexDirection: 'row', alignItems: 'center', gap: space(4) },
  plus: { width: 46, height: 46, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  rt: { color: '#fff', fontSize: 19, fontWeight: '700' },
  rs: { color: 'rgba(255,255,255,0.92)', fontSize: 13, marginTop: 3 },

  sync: { flexDirection: 'row', alignItems: 'center', gap: space(2) },
  syncText: { fontSize: 12.5, color: colors.ink3 },

  note: { fontSize: 13, color: colors.ink3 },
})
