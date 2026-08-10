import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Screen } from '@/ui/Screen'
import { colors, radius, space } from '@/ui/theme'
import { useAuth } from '@/auth/useAuth'

export default function Mais() {
  const { logout } = useAuth()
  return (
    <Screen>
      <View style={styles.wrap}>
        <Text style={styles.title}>Mais</Text>
        <Pressable
          onPress={logout}
          style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.bad} />
          <Text style={styles.rowText}>Sair</Text>
        </Pressable>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: space(5), gap: space(4) },
  title: { fontSize: 18, fontWeight: '700', color: colors.ink },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(3),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    padding: space(4),
  },
  rowText: { fontSize: 15, fontWeight: '600', color: colors.bad },
})
