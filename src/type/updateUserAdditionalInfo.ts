export type UpdateUserAdditionalInfo = {
  contacts: object[]
  mailingAddress: object
  preferences: object
}

export type UpdateUserAdditionalInfoResponse = {
  isAdditionaUserInfoUpdated: boolean
  error: string
}
