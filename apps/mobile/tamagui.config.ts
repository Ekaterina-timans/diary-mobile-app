import { createTamagui } from '@tamagui/core'
import { createInterFont } from '@tamagui/font-inter'
import { config } from '@tamagui/config/v3'

const headingFont = createInterFont()
const bodyFont = createInterFont()

export const tamaguiConfig = createTamagui({
  ...config,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  }
})

export type AppTamauiConfig = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppTamauiConfig {}
}