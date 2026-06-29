import { Tabs } from 'expo-router'
import { CreditCard, Home, List, Target } from 'lucide-react-native'
import MonthYearSelector from '../../components/MonthYearSelector'
import { colors } from '../../theme/tokens'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerRight: () => <MonthYearSelector />,
        headerRightContainerStyle: { paddingRight: 16 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="cartoes"
        options={{
          title: 'Cartões',
          tabBarIcon: ({ color, size }) => <CreditCard color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="extrato"
        options={{
          title: 'Extrato',
          tabBarIcon: ({ color, size }) => <List color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="metas"
        options={{
          title: 'Sobra / Metas',
          tabBarIcon: ({ color, size }) => <Target color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
