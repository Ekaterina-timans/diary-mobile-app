import { Feather } from '@expo/vector-icons'

// Конфигурация строк главного экрана настроек: иконка, подпись и маршрут назначения.
export type FeatherIconName = keyof typeof Feather.glyphMap

export type SettingsItemConfig = {
  key: string
  icon: FeatherIconName
  title: string
  route: string
}

// Экран настроек строит список из этой конфигурации, поэтому добавление нового раздела
// обычно начинается с новой записи здесь.
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
