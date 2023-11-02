export interface AuthResponse {
  sessionToken: string | null
  displayName: string
  error: string | undefined
  pending: boolean
}

export interface AuthWithProfileResponse extends AuthResponse {
  isProfileUpdated: boolean
}
