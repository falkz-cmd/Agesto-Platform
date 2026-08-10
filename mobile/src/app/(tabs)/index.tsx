import { useEffect, useState } from 'react'
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Screen } from '@/ui/Screen'
import { JobCard } from '@/ui/JobCard'
import { colors, radius, space } from '@/ui/theme'
import { db } from '@/db/instance'
import type { AgendaItem } from '@/types/api'

function dataHoje(): string {
  const s = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function Inicio() {
  const [agenda, setAgenda] = useState<AgendaItem[]>([])

  useEffect(() => {
    ;(async () => {
      const items = await db.getAgenda()
      items.sort((a, b) => String(a.dataAgendada).localeCompare(String(b.dataAgendada)))
      setAgenda(items)
    })()
  }, [])

  const proximo = agenda[0]
  const resto = agenda.slice(1)

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

      <ScrollView contentContainerStyle={styles.body}>
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

        <View style={styles.today}>
          <Text style={styles.todayDate}>{dataHoje()}</Text>
          <Text style={styles.todayCount}>{agenda.length} na agenda</Text>
        </View>

        {proximo && (
          <View style={styles.section}>
            <Text style={styles.label}>Próximo</Text>
            <JobCard item={proximo} highlight />
          </View>
        )}

        {resto.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Ainda hoje</Text>
            <View style={{ gap: space(2.75) }}>
              {resto.map((item) => (
                <JobCard key={item.id} item={item} />
              ))}
            </View>
          </View>
        )}

        {agenda.length === 0 && (
          <Text style={styles.empty}>Sem atendimentos na agenda de hoje.</Text>
        )}
      </ScrollView>
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

  body: { padding: space(4), gap: space(4) },
  register: { backgroundColor: colors.brand, borderRadius: radius.card, padding: space(5), flexDirection: 'row', alignItems: 'center', gap: space(4) },
  plus: { width: 46, height: 46, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  rt: { color: '#fff', fontSize: 19, fontWeight: '700' },
  rs: { color: 'rgba(255,255,255,0.92)', fontSize: 13, marginTop: 3 },

  today: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space(1) },
  todayDate: { fontSize: 15, fontWeight: '600', color: colors.ink },
  todayCount: { fontSize: 13, color: colors.ink3 },

  section: { gap: space(2.5) },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: colors.ink4, paddingHorizontal: space(1) },
  empty: { fontSize: 13, color: colors.ink3, paddingHorizontal: space(1) },
})
