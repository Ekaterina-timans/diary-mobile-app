import { getPluralForm } from '@/src/shared/utils/getPluralForm'

describe('getPluralForm', () => {
  const journalForms = ['журнал', 'журнала', 'журналов'] as const

  test('возвращает форму для одного журнала', () => {
    expect(getPluralForm(1, journalForms)).toBe('журнал')
  })

  test('возвращает форму для двух журналов', () => {
    expect(getPluralForm(2, journalForms)).toBe('журнала')
  })

  test('возвращает форму для пяти журналов', () => {
    expect(getPluralForm(5, journalForms)).toBe('журналов')
  })

  test('учитывает исключение для числа 11', () => {
    expect(getPluralForm(11, journalForms)).toBe('журналов')
  })
})
