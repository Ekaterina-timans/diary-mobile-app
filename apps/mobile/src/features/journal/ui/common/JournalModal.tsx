import { Feather } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from 'react-native'
import { Text, XStack, YStack } from 'tamagui'

type JournalModalProps = {
  visible: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export function JournalModal({
  visible,
  title,
  children,
  onClose,
}: JournalModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
            backgroundColor: 'rgba(18, 15, 30, 0.35)',
          }}
        >
          <Pressable
            accessibilityLabel="Закрыть"
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          />

          <YStack
            width="100%"
            maxWidth={420}
            maxHeight="85%"
            backgroundColor="$backgroundStrong"
            borderColor="$border"
            borderRadius={24}
            borderWidth={1}
            gap="$4"
            padding="$5"
          >
            <XStack alignItems="center" justifyContent="space-between">
              <Text fontSize="$7" fontWeight="800">
                {title}
              </Text>

              <Pressable
                accessibilityLabel="Закрыть"
                hitSlop={12}
                onPress={onClose}
              >
                <Feather name="x" size={22} color="#777777" />
              </Pressable>
            </XStack>

            {children}
          </YStack>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
