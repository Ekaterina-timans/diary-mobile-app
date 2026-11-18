import { CreateMenu } from '@/src/features/journal/ui/create/CreateMenu'
import tamaguiConfig from '@/tamagui.config'
import { TamaguiProvider } from 'tamagui'
import { fireEvent, render } from '@testing-library/react-native'

async function renderCreateMenu() {
  const onClose = jest.fn()
  const onCreateJournal = jest.fn()
  const onCreateFolder = jest.fn()

  const screen = await render(
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <CreateMenu
        visible
        onClose={onClose}
        onCreateJournal={onCreateJournal}
        onCreateFolder={onCreateFolder}
      />
    </TamaguiProvider>,
  )

  return {
    ...screen,
    onClose,
    onCreateJournal,
    onCreateFolder,
  }
}

describe('CreateMenu', () => {
  test('показывает варианты создания журнала и папки', async () => {
    const { getByText } = await renderCreateMenu()
    // toBeTruthy() подтверждает, что элемент существует
    expect(getByText('Создать')).toBeTruthy()
    expect(getByText('Журнал')).toBeTruthy()
    expect(getByText('Папку')).toBeTruthy()
  })

  test('вызывает onCreateJournal после нажатия на Журнал', async () => {
    const { getByText, onCreateJournal } = await renderCreateMenu()
    // Имитируем нажатие на журанл
    await fireEvent.press(getByText('Журнал'))
    // После нажатия на “Журнал” функция onCreateJournal должна вызваться ровно один раз
    expect(onCreateJournal).toHaveBeenCalledTimes(1)
  })

  test('вызывает onCreateFolder после нажатия на Папку', async () => {
    const { getByText, onCreateFolder } = await renderCreateMenu()

    await fireEvent.press(getByText('Папку'))

    expect(onCreateFolder).toHaveBeenCalledTimes(1)
  })

  test('вызывает onClose после нажатия на крестик', async () => {
    const { getByLabelText, onClose } = await renderCreateMenu()

    await fireEvent.press(getByLabelText('Закрыть меню'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
