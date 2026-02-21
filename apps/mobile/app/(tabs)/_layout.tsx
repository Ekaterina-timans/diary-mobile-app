import { Feather } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import { useTheme } from 'tamagui'
import { View } from 'react-native'

export default function TabLayout() {
  const theme = useTheme()

  const renderIcon =
    (name: any) =>
    ({ color, focused }: any) => (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {focused && (
          <View
            style={{
              position: 'absolute',
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: theme.primaryGlow.val,
              opacity: 0.22,
              shadowColor: theme.primaryGlow.val,
              shadowOpacity: 0.6,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 0 },
            }}
          />
        )}

        <Feather name={name} size={focused ? 24 : 22} color={color} />
      </View>
    )

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.primary.val,
        tabBarInactiveTintColor: theme.muted.val,

        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.3)',
          backgroundColor: 'transparent',
          elevation: 0,
          height: 88,
          paddingBottom: 24,
        },
        tabBarItemStyle: {
          paddingTop: 6,
        },

        tabBarBackground: () => (
          <BlurView
            intensity={40}
            tint="light"
            style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.6)',
            }}
          />
        ),

        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Главная',
          tabBarIcon: renderIcon('home'),
        }}
      />

      <Tabs.Screen
        name="journal"
        options={{
          title: 'Дневник',
          tabBarIcon: renderIcon('book-open'),
        }}
      />

      <Tabs.Screen
        name="notes"
        options={{
          title: 'Заметки',
          tabBarIcon: renderIcon('file-text'),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Настройки',
          tabBarIcon: renderIcon('settings'),
        }}
      />
    </Tabs>
  )
}
