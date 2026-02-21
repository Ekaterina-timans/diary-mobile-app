import { H1 } from 'tamagui'

// Это простой wrapper над Tamagui.
// Он:
// создаёт единый стиль заголовков
// может потом расширяться

export function Title({ children }: { children: React.ReactNode }) {
  return <H1>{children}</H1>
}
