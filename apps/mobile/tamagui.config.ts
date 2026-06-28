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
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      background: '#F8F7FF',
      backgroundStrong: '#FFFFFF',
      surfaceGlass: 'rgba(255,255,255,0.65)',
      text: '#0F172A',
      muted: '#64748B',
      border: 'rgba(15,23,42,0.08)',
      primary: '#7C3AED',
      primaryGlow: '#8B5CF6',
      primaryGradientStart: '#8B5CF6',
      primaryGradientEnd: '#6366F1',
      primaryText: '#FFFFFF',
      danger: '#E11D48',
    },
    dark: {
      ...config.themes.dark,
      background: '#0B1020',
      backgroundStrong: '#11162B',
      surfaceGlass: 'rgba(17,22,43,0.6)',
      text: '#F1F5F9',
      muted: '#94A3B8',
      border: 'rgba(148,163,184,0.15)',
      primary: '#8B5CF6',
      primaryGlow: '#A78BFA',
      primaryGradientStart: '#8B5CF6',
      primaryGradientEnd: '#6366F1',
      primaryText: '#FFFFFF',
      danger: '#FB7185',
    },
  },
})

export default tamaguiConfig

export type AppTamauiConfig = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppTamauiConfig {}
}
