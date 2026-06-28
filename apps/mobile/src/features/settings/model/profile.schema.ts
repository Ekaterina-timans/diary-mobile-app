import { z } from 'zod'

export const profileSchema = z.object({
  displayName: z.string().min(2, 'Минимум 2 символа').max(50, 'Слишком длинное имя'),
  email: z.string().email('Некорректный email'),
})

export const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Минимум 6 символов'),
  newPassword: z.string().min(6, 'Минимум 6 символов'),
})

export const changePasswordFormSchema = passwordSchema
  .extend({
    confirmNewPassword: z.string().min(6, 'Минимум 6 символов'),
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmNewPassword'],
  })

export type ProfileFormValues = z.infer<typeof profileSchema>
export type PasswordFormValues = z.infer<typeof passwordSchema>
export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>
