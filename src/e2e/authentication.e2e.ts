import {
  changePassword,
  confirmPasswordResetEmail,
  create,
  login,
  logout,
  removeUser,
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
      displayName: null,
    })
  })

  it('should be able to create', async () => {
    const result = await create('e2e_create', 'abc123')
    expect(result).toStrictEqual({
      pending: false,
      isProfileUpdated: false,
      error: 'Firebase: Error (auth/invalid-email).',
      sessionToken: null,
      displayName: null,
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

  it('should be able to removeUser', async () => {
    const result = await removeUser()
    expect(result).toStrictEqual({
      isRemoved: false,
      error: "Cannot read properties of null (reading 'delete')",
    })
  })

  describe('full cycle test', () => {
    const username = 'walcoorperation.1@gmail.com'
    const oldPassword = 'abc123'
    const newPassword = 'def123'
    const displayName = 'alice'

    it('should be able to create user', async () => {
      const result = await create(username, oldPassword, displayName)
      expect(result.error).toBeUndefined()
      expect(result.isProfileUpdated).toBeTruthy()
      expect(result.displayName).toBe(displayName)
    })

    it('should be able to change password after create', async () => {
      const result = await changePassword(oldPassword, newPassword)
      expect(result.error).toBeUndefined()
      expect(result.isChanged).toBeTruthy()
    })

    it('should be able to logout', async () => {
      await logout()
    })

    it('should be able to send reset email', async () => {
      const result = await resetEmail(username, 'https://zelda.walcron.com')
      expect(result.isSent).toBeTruthy()
    })

    xit('should be able to confirm email', async () => {
      //confirmPasswordResetEmail('bob')
    })

    it('should be able to login', async () => {
      const result = await login(username, newPassword)
      expect(result.error).toBeUndefined()
      expect(result.sessionToken).toBeDefined()
      expect(result.displayName).toBe(displayName)
    })

    it('should be able to remove user after login', async () => {
      const result = await removeUser()
      expect(result.error).toBeUndefined()
      expect(result.isRemoved).toBeTruthy()
    })
  })
})
