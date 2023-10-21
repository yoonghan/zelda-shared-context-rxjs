import {
  changePassword,
  confirmPasswordResetEmail,
  create,
  login,
  logout,
  resetEmail,
} from '../authentication'
import 'whatwg-fetch'

describe('authenticate', () => {
  it('should be able to logout', async () => {
    await logout()
  })

  it('should be able to login', async () => {
    const result = await login('e2e_login', 'abc123')
    expect(result).toStrictEqual({
      pending: false,
      error: 'Firebase: Error (auth/invalid-email).',
      sessionToken: null,
    })
  })

  it('should be able to create', async () => {
    const result = await create('e2e_create', 'abc123')
    expect(result).toStrictEqual({
      pending: false,
      isProfileUpdated: false,
      error: 'Firebase: Error (auth/invalid-email).',
      sessionToken: null,
    })
  })

  it('should be able to change password', async () => {
    const result = await changePassword('someOldPassword', 'aNewPassword')
    expect(result).toStrictEqual({
      isChanged: false,
      error: 'User is not logged in.',
    })
  })

  it('should be able to resetEmail password', async () => {
    const result = await resetEmail('bob', 'https://resetme.com')
    expect(result).toStrictEqual({
      isSent: false,
      error: 'Firebase: Error (auth/invalid-email).',
    })
  })

  it('should be able to confirmEmailReset password', async () => {
    const result = await confirmPasswordResetEmail('CODEC', 'newPassword')
    expect(result).toStrictEqual({
      isChanged: false,
      error: 'Firebase: Error (auth/invalid-action-code).',
    })
  })
})
