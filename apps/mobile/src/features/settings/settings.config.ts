import { Feather } from '@expo/vector-icons'

export type FeatherIconName = keyof typeof Feather.glyphMap

export type SettingsItemConfig = {
  key: string
  icon: FeatherIconName
  title: string
  route: string
}

export const SETTINGS_ITEMS: SettingsItemConfig[] = [
  {
    key: 'profile',
    icon: 'user',
    title: 'Профиль',
    route: '/settings/profile',
  },
  {
    key: 'notifications',
    icon: 'bell',
    title: 'Уведомления',
    route: '/settings/notifications',
  },
  {
    key: 'privacy',
    icon: 'lock',
    title: 'Конфиденциальность',
    route: '/settings/privacy',
  },
  {
    key: 'appearance',
    icon: 'sliders',
    title: 'Оформление',
    route: '/settings/appearance',
  },
  {
    key: 'data',
    icon: 'database',
    title: 'Данные',
    route: '/settings/data',
  },
]
