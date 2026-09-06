type WordForms = readonly [one: string, few: string, many: string]

export function getPluralForm(count: number, [one, few, many]: WordForms) {
  const value = Math.abs(count)

  if (value % 10 === 1 && value % 100 !== 11) {
    return one
  }

  if (
    value % 10 >= 2 &&
    value % 10 <= 4 &&
    (value % 100 < 10 || value % 100 >= 20)
  ) {
    return few
  }

  return many
}
