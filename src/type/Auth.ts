export interface AuthResponse {
  sessionToken: string | null
  error: string | undefined
  pending: boolean
}

export interface AuthWithProfileResponse extends AuthResponse {
  isProfileUpdated: boolean
}
