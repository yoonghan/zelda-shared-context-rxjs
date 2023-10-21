export type ChangePasswordResponse = {
  isChanged: boolean
  error: string | undefined
}

export type EmailPasswordResetResponse = {
  isSent: boolean
  error: string | undefined
}
