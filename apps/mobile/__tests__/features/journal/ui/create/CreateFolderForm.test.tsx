import { CreateFolderForm } from "@/src/features/journal/ui/create/CreateFolderForm"
import tamaguiConfig from "@/tamagui.config"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { TamaguiProvider } from "tamagui"

async function renderCreateFolderForm() {
  const onClose = jest.fn()
  const onCreate = jest.fn().mockResolvedValue(undefined)

  const screen = await render(
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <CreateFolderForm
        visible
        onClose={onClose}
        onCreate={onCreate}
      />
    </TamaguiProvider>
  )

  return {
    ...screen,
    onClose,
    onCreate
  }
}

describe('CreateFolderForm', () => {
  test('показывает заголовок, поле названия и кнопку создания', async () => {
    // Рендерим форму через helper: он добавляет TamaguiProvider
    // и передаёт тестовые функции onCreate и onClose
    const { getByPlaceholderText, getByText } = await renderCreateFolderForm()

    // Проверяем, что пользователь видит основные элементы формы
    expect(getByText('Новая папка')).toBeTruthy()
    expect(getByPlaceholderText('Например, Май 2026')).toBeTruthy()
    expect(getByText('Создать папку')).toBeTruthy()
  })

  // Проверка валидации пустого названия
  test('не вызывает onCreate и показывает ошибку для пустого названия', async () => {
    const { getByText, onCreate } = await renderCreateFolderForm()

    // Имитируем нажатие кнопки без ввода названия папки
    await fireEvent.press(getByText('Создать папку'))

    // React Hook Form и Zod проверяют форму асинхронно,
    // поэтому ждём появления сообщения валидации
    await waitFor(() => {
      expect(getByText('Введите название папки')).toBeTruthy()
    }) 

    // Невалидная форма не должна вызывать действие создания папки
    expect(onCreate).not.toHaveBeenCalled()
  })

  test('передаёт название папки и закрывает форму после успешного создания', async () => {
    const {
      getByPlaceholderText,
      getByText,
      onClose,
      onCreate
    } = await renderCreateFolderForm()

    // Пользователь вводит название с лишними пробелами по краям
    await fireEvent.changeText(getByPlaceholderText('Например, Май 2026'),'  Май 2026  ')

    // Имитируем нажатие кнопки создания
    await fireEvent.press(getByText('Создать папку'))

    await waitFor(() => {
      // Zod-схема удаляет пробелы через .trim() перед передачей значения дальше
      expect(onCreate).toHaveBeenCalledWith('Май 2026')

      // Форма закрывается только после успешного выполнения onCreate
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  test('показывает ошибку и не закрывает форму, если создание не удалось', async () => {
    const {
      getByPlaceholderText,
      getByText,
      onClose,
      onCreate,
    } = await renderCreateFolderForm()

    // Имитируем ошибку API при попытке создать папку
    onCreate.mockRejectedValueOnce(new Error('Ошибка сети'))

    await fireEvent.changeText(getByPlaceholderText('Например, Май 2026'), 'Май 2026')
    await fireEvent.press(getByText('Создать папку'))

    await waitFor(() => {
      // Пользователь получает понятное сообщение вместо тихого сбоя
      expect(getByText('Не удалось создать папку. Попробуйте ещё раз.')).toBeTruthy()
    })

    // При ошибке форма остаётся открытой, чтобы пользователь мог повторить попытку
    expect(onClose).not.toHaveBeenCalled()
  })
})