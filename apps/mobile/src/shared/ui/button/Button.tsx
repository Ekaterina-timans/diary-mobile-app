import { Button as TButton, useTheme } from 'tamagui'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, PressableProps, GestureResponderEvent } from 'react-native'
import { PropsWithChildren } from 'react'

type Variant = 'primary' | 'neutral' | 'danger'
type Size = 'md' | 'lg'

interface ButtonProps extends PropsWithChildren {
  variant?: Variant
  size?: Size
  disabled?: boolean
  onPress?: (event: GestureResponderEvent) => void
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  onPress,
}: ButtonProps) {
  const theme = useTheme()

  const height = size === 'lg' ? 56 : 48
  const borderRadius = 20

  const pressableStyle: PressableProps['style'] = ({ pressed }) => ({
    transform: [{ scale: pressed ? 0.97 : 1 }],
    opacity: disabled ? 0.6 : 1,
  })

  if (variant === 'primary') {
    return (
      <Pressable disabled={disabled} onPress={onPress} style={pressableStyle}>
        <LinearGradient
          colors={[
            theme.primaryGradientStart?.val ?? '#8B5CF6',
            theme.primaryGradientEnd?.val ?? '#6366F1',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius,
            height,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: theme.primaryGlow?.val ?? '#8B5CF6',
            shadowOpacity: 0.6,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 10 },
          }}
        >
          <TButton chromeless pointerEvents="none" height={height} color="#FFFFFF">
            {children}
          </TButton>
        </LinearGradient>
      </Pressable>
    )
  }

  if (variant === 'neutral') {
    return (
      <Pressable disabled={disabled} onPress={onPress} style={pressableStyle}>
        <LinearGradient
          colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.4)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius,
            height,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.4)',
          }}
        >
          <TButton chromeless pointerEvents="none" height={height} color="#5B4FBF">
            {children}
          </TButton>
        </LinearGradient>
      </Pressable>
    )
  }

  return (
    <Pressable disabled={disabled} onPress={onPress} style={pressableStyle}>
      <TButton
        chromeless
        pointerEvents="none"
        height={height}
        borderRadius={borderRadius}
        backgroundColor="#EF4444"
        color="#FFFFFF"
      >
        {children}
      </TButton>
    </Pressable>
  )
}
