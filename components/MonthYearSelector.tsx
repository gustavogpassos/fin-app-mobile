import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme/tokens'
import { useFinStore } from '../store/useFinStore'

export default function MonthYearSelector() {
  const mesRef = useFinStore((s) => s.mesRef)
  const anoRef = useFinStore((s) => s.anoRef)
  const setMesRef = useFinStore((s) => s.setMesRef)
  const setAnoRef = useFinStore((s) => s.setAnoRef)

  const label = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(
    new Date(anoRef, mesRef - 1, 1),
  )

  function prev() {
    if (mesRef === 1) {
      setMesRef(12)
      setAnoRef(anoRef - 1)
    } else {
      setMesRef(mesRef - 1)
    }
  }

  function next() {
    if (mesRef === 12) {
      setMesRef(1)
      setAnoRef(anoRef + 1)
    } else {
      setMesRef(mesRef + 1)
    }
  }

  return (
    <View style={styles.row}>
      <Pressable onPress={prev} hitSlop={8}>
        <ChevronLeft size={20} color={colors.text} />
      </Pressable>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={next} hitSlop={8}>
        <ChevronRight size={20} color={colors.text} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'capitalize',
  },
})
