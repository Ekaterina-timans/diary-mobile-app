import { Feather } from '@expo/vector-icons'
import { Modal, Pressable, View } from 'react-native'
import { Text, XStack, YStack } from 'tamagui'

type CreateMenuProps = {
  visible: boolean
  onClose: () => void
  onCreateJournal: () => void
  onCreateFolder: () => void
}

type CreateMenuItemProps = {
  icon: 'book-open' | 'folder-plus'
  title: string
  description: string
  onPress: () => void
}

function CreateMenuItem({
  icon,
  title,
  description,
  onPress,
}: CreateMenuItemProps) {
  return (
    <Pressable onPress={onPress}>
      <XStack
        alignItems="center"
        borderColor="$border"
        borderRadius={18}
        borderWidth={1}
        gap="$3"
        padding="$3"
      >
        <YStack
          alignItems="center"
          backgroundColor="#F1EEFF"
          borderRadius={14}
          height={44}
          justifyContent="center"
          width={44}
        >
          <Feather name={icon} size={20} color="#4F46B5" />
        </YStack>

        <YStack flex={1} gap="$1">
          <Text fontSize="$5" fontWeight="700">
            {title}
          </Text>
          <Text fontSize="$3" opacity={0.55}>
            {description}
          </Text>
        </YStack>

        <Feather name="chevron-right" size={20} color="#999999" />
      </XStack>
    </Pressable>
  )
}

export function CreateMenu({
  visible,
  onClose,
  onCreateJournal,
  onCreateFolder,
}: CreateMenuProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
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
          backgroundColor="$backgroundStrong"
          borderColor="$border"
          borderRadius={24}
          borderWidth={1}
          gap="$4"
          padding="$5"
        >
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontSize="$7" fontWeight="800">
              Создать
            </Text>

            <Pressable
              accessibilityLabel="Закрыть"
              hitSlop={12}
              onPress={onClose}
            >
              <Feather name="x" size={22} color="#777777" />
            </Pressable>
          </XStack>

          <YStack gap="$3">
            <CreateMenuItem
              icon="book-open"
              title="Журнал"
              description="Дневник, книга или сборник идей"
              onPress={onCreateJournal}
            />

            <CreateMenuItem
              icon="folder-plus"
              title="Папку"
              description="Объедините журналы по теме или периоду"
              onPress={onCreateFolder}
            />
          </YStack>
        </YStack>
      </View>
    </Modal>
  )
}
