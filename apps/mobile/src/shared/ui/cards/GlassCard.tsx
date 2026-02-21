import React from 'react'
import { Platform } from 'react-native'
import { YStack, YStackProps } from 'tamagui'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'

type Props = YStackProps & {
  variant?: 'light' | 'dark'
}

export function GlassCard({ children, variant = 'light', ...props }: Props) {
  const isDark = variant === 'dark'

  const glassFill = isDark ? 'rgba(10,10,18,0.18)' : 'rgba(255,255,255,0.05)'
  const border = isDark ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.30)'

  // тонкий хайлайт по краю
  const innerStroke = isDark
    ? (['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.03)', 'rgba(255,255,255,0.10)'] as const)
    : (['rgba(255,255,255,0.42)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0.22)'] as const)

  // неоновое свечение
  const glowColor = isDark ? '#7C5CFF' : '#8B5CF6'

  const blurIntensity = isDark ? 35 : 55
  const blurTint = isDark ? 'dark' : 'light'

  return (
    <YStack
      position="relative"
      borderRadius={28}
      overflow="hidden"
      borderWidth={1}
      borderColor={border}
      shadowColor={glowColor}
      shadowOpacity={isDark ? 0.35 : 0.22}
      shadowRadius={isDark ? 24 : 26}
      shadowOffset={{ width: 0, height: 14 }}
      elevation={Platform.OS === 'android' ? 12 : undefined}
      {...props}
    >
      <LinearGradient
        colors={innerStroke}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 }}
      />

      <BlurView intensity={blurIntensity} tint={blurTint} style={{ width: '100%' }}>
        <YStack padding="$5" gap="$4" backgroundColor={glassFill}>
          {children}
        </YStack>
      </BlurView>

      <YStack
        pointerEvents="none"
        position="absolute"
        inset={0}
        borderRadius={28}
        borderWidth={1}
        borderColor={isDark ? 'rgba(160,130,255,0.30)' : 'rgba(170,140,255,0.22)'}
        shadowColor={glowColor}
        shadowOpacity={isDark ? 0.55 : 0.35}
        shadowRadius={16}
        shadowOffset={{ width: 0, height: 0 }}
      />
    </YStack>
  )
}
