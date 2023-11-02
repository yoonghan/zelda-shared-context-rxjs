export type UpdateUserRequest = {
  displayName: string
}

export type UpdateUserResponse = {
  isProfileUpdated: boolean
  error?: string
}
