import { getJournalFolders, getJournals } from '@/src/features/journal/model/journal.api'
import { JournalList } from '@/src/features/journal/ui/list/JournalList'
import tamaguiConfig from '@/tamagui.config'
import { fireEvent, waitFor, render } from '@testing-library/react-native'
import * as mockReact from 'react'
import { TamaguiProvider } from 'tamagui'

// В настоящем приложении useFocusEffect запускает загрузку,
// когда пользователь открывает экран. В тесте повторяем это через useEffect
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn()
  },
  useFocusEffect: (effect: () => void | (() => void)) => {
    mockReact.useEffect(effect, [effect])
  },
}))

// Не выполняем реальные HTTP-запросы: сами задаём ответы API в тесте
jest.mock('@/src/features/journal/model/journal.api', () => ({
  getJournalFolders: jest.fn(),
  getJournals: jest.fn(),
  createJournal: jest.fn(),
  createJournalFolder: jest.fn(),
}))

const getJournalFoldersMock = jest.mocked(getJournalFolders)
const getJournalsMock = jest.mocked(getJournals)

async function renderJournalList() {
  return render(
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <JournalList />
    </TamaguiProvider>,
  )
}

describe('JournalList', () => {
  beforeEach(() => {
    // Каждый тест начинается с чистой историей вызовов и пустым дневником
    jest.clearAllMocks()
    getJournalFoldersMock.mockResolvedValue([])
    getJournalsMock.mockResolvedValue([])
  })

  test('открывает форму создания журнала через меню создания', async () => {
    const { getByLabelText, getByText } = await renderJournalList()

    // Ждём окончания загрузки данных и появления пустого состояния дневника
    await waitFor(() => {
      expect(getByText('Здесь появятся ваши истории')).toBeTruthy()
    })

    // Пользователь открывает меню создания в заголовке экрана
    await fireEvent.press(getByLabelText('Создать журнал или папку'))

    // Появление описания доказывает, что открылось именно CreateMenu
    expect(getByText('Дневник, книга или сборник идей')).toBeTruthy()

    // Выбираем создание журнала, а не папки
    await fireEvent.press(getByText('Журнал'))

    // JournalList меняет createMode, поэтому отображается настоящая форма журнала
    await waitFor(() => {
      expect(getByText('Новый журнал')).toBeTruthy()
    })
  })
})
