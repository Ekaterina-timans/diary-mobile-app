import { createTamagui } from '@tamagui/core'
import { createInterFont } from '@tamagui/font-inter'
import { config } from '@tamagui/config/v3'

const headingFont = createInterFont({
  weight: {
    400: '400',
    500: '500',
    600: '600',
    700: '700',
    800: '800',
  },
})

const bodyFont = createInterFont({
  weight: {
    400: '400',
    500: '500',
    600: '600',
  },
})

export const tamaguiConfig = createTamagui({
  ...config,

  fonts: {
    heading: headingFont,
    body: bodyFont,
  },

  // Семантические цвета
  themes: {
    ...config.themes,

    // 🔮 SOFT AURORA (LIGHT)
    light: {
      ...config.themes.light,

      // Base
      background: '#F8F7FF',           // мягкий фоновый
      backgroundStrong: '#FFFFFF',     // для surface
      surfaceGlass: 'rgba(255,255,255,0.65)',

      // Typography
      text: '#0F172A',
      muted: '#64748B',

      // Borders
      border: 'rgba(15,23,42,0.08)',

      // Primary (Aurora)
      primary: '#7C3AED',
      primaryGlow: '#8B5CF6',
      primaryGradientStart: '#8B5CF6',
      primaryGradientEnd: '#6366F1',
      primaryText: '#FFFFFF',

      // Danger
      danger: '#E11D48',
    },

    // 🌌 DARK MINIMAL + GLOW
    dark: {
      ...config.themes.dark,

      // Base
      background: '#0B1020',
      backgroundStrong: '#11162B',
      surfaceGlass: 'rgba(17,22,43,0.6)',

      // Typography
      text: '#F1F5F9',
      muted: '#94A3B8',

      // Borders
      border: 'rgba(148,163,184,0.15)',

      // Primary (Glow)
      primary: '#8B5CF6',
      primaryGlow: '#A78BFA',
      primaryGradientStart: '#8B5CF6',
      primaryGradientEnd: '#6366F1',
      primaryText: '#FFFFFF',

      danger: '#FB7185',
    },
  },
})

export type AppTamauiConfig = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppTamauiConfig {}
}
