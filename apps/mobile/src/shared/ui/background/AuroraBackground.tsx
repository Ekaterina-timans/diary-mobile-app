import React, { useEffect, useMemo } from 'react'
import { View, StyleSheet, Dimensions, useColorScheme } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')
const PARTICLE_COUNT = 18

function Particle({ delay, color, glow }: { delay: number; color: string; glow: string }) {
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.6)

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    )

    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1.3, {
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    )
  }, [delay])

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const top = Math.random() * height
  const left = Math.random() * width

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top,
          left,
          width: 5,
          height: 5,
          borderRadius: 5,
          backgroundColor: color,
          shadowColor: glow,
          shadowOpacity: 0.9,
          shadowRadius: 12,
        },
        style,
      ]}
    />
  )
}

export function AuroraBackground() {
  const scheme = useColorScheme()
  const isDark = scheme === 'dark'

  // Цвета по теме
  const gradientColors = isDark
    ? (['#0E0F1A', '#1B1440', '#2A1F73'] as const)
    : (['#EDE7FF', '#CFC0FF', '#A98DFF'] as const)

  const particleColor = isDark ? '#9C7BFF' : '#FFF3C4'

  const glowColor = isDark ? '#6F4CFF' : '#FFE8A3'

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <Particle key={i} delay={i * 250} color={particleColor} glow={glowColor} />
      )),
    [particleColor],
  )

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Световая дуга */}
      <View
        style={{
          position: 'absolute',
          top: -140,
          right: -140,
          width: 520,
          height: 520,
          borderRadius: 520,
          backgroundColor: isDark ? 'rgba(120,90,255,0.25)' : 'rgba(255,255,255,0.25)',
        }}
      />

      {particles}
    </View>
  )
}
