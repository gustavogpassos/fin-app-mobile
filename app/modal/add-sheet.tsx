import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../theme/tokens'

export default function AddSheet() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar</Text>
      <Pressable style={styles.closeBtn} onPress={() => router.back()}>
        <Text style={styles.closeTxt}>Fechar</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  title: { fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 24 },
  closeBtn: { paddingVertical: 10, paddingHorizontal: 24, backgroundColor: colors.border, borderRadius: 8 },
  closeTxt: { color: colors.text, fontWeight: '500' },
})
