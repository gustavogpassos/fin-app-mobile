import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../../theme/tokens'

export default function ExtratoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Extrato</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
})
