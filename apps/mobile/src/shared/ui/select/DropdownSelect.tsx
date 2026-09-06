import { Feather } from '@expo/vector-icons'
import { useRef, useState } from 'react'
import { Modal, Pressable, ScrollView, View } from 'react-native'
import { Text, XStack, YStack } from 'tamagui'

export type DropdownOption = {
  value: string | null
  label: string
}

type DropdownSelectProps = {
  label: string
  options: DropdownOption[]
  placeholder: string
  value: string | null
  onChange: (value: string | null) => void
}

export function DropdownSelect({
  label,
  options,
  placeholder,
  value,
  onChange,
}: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0, width: 0 })
  const triggerRef = useRef<View>(null)
  const selectedOption = options.find((option) => option.value === value)

  function selectOption(nextValue: string | null) {
    onChange(nextValue)
    setIsOpen(false)
  }

  function toggleMenu() {
    if (isOpen) {
      setIsOpen(false)
      return
    }

    triggerRef.current?.measureInWindow((left, top, width, height) => {
      setMenuPosition({ left, top: top + height + 8, width })
      setIsOpen(true)
    })
  }

  return (
    <YStack position="relative" zIndex={isOpen ? 10 : 1} gap="$2">
      <Text color="$muted">{label}</Text>

      <View ref={triggerRef} collapsable={false}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isOpen }}
          onPress={toggleMenu}
        >
          <XStack
            alignItems="center"
            borderColor={isOpen ? '#4F46B5' : '$border'}
            borderRadius={16}
            borderWidth={1}
            justifyContent="space-between"
            padding="$3"
            width="100%"
          >
            <Text>{selectedOption?.label ?? placeholder}</Text>
            <Feather
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#777777"
            />
          </XStack>
        </Pressable>
      </View>

      {isOpen && (
        <Modal transparent visible={isOpen} animationType="none" onRequestClose={() => setIsOpen(false)}>
          <View style={{ flex: 1 }}>
            <Pressable
              accessibilityLabel="Закрыть список"
              onPress={() => setIsOpen(false)}
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
            />

            <YStack
              position="absolute"
              left={menuPosition.left}
              top={menuPosition.top}
              width={menuPosition.width}
              maxHeight={260}
              backgroundColor="$backgroundStrong"
              borderColor="$border"
              borderRadius={16}
              borderWidth={1}
              elevation={8}
              overflow="hidden"
              shadowColor="#000000"
              shadowOpacity={0.14}
              shadowRadius={16}
              shadowOffset={{ width: 0, height: 8 }}
            >
              <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
                <YStack padding="$2" gap="$1">
                  {options.map((option) => {
                    const isSelected = option.value === value

                    return (
                      <Pressable
                        key={option.value ?? 'empty'}
                        onPress={() => selectOption(option.value)}
                      >
                        <XStack
                          alignItems="center"
                          backgroundColor={isSelected ? '#F1EEFF' : 'transparent'}
                          borderRadius={12}
                          justifyContent="space-between"
                          padding="$3"
                        >
                          <Text fontWeight={isSelected ? '700' : '400'}>{option.label}</Text>
                          {isSelected && <Feather name="check" size={18} color="#4F46B5" />}
                        </XStack>
                      </Pressable>
                    )
                  })}
                </YStack>
              </ScrollView>
            </YStack>
          </View>
        </Modal>
      )}
    </YStack>
  )
}
