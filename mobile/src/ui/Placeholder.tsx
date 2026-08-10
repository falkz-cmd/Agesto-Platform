import { View, Text, StyleSheet } from 'react-native'
import { Screen } from './Screen'
import { colors, radius, space } from './theme'

export function Placeholder({ title }: { title: string }) {
  return (
    <Screen>
      <View style={styles.wrap}>
        <Text style={styles.tag}>EM CONSTRUÇÃO</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>Esta aba será construída nas próximas tarefas.</Text>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'flex-start', gap: space(2), padding: space(5) },
  tag: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.ink4,
    backgroundColor: colors.surface2,
    borderRadius: radius.pill,
    paddingHorizontal: space(2.5),
    paddingVertical: space(1),
    overflow: 'hidden',
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.ink },
  desc: { fontSize: 13, color: colors.ink3 },
})
