import './__custom_mocks__/firebase/auth'
import { credentials } from './__custom_mocks__/const'
import {
  auth$,
  changePassword,
  confirmPasswordResetEmail,
  create,
  login,
  logout,
  removeUser,
  resetEmail,
  updateUserLogin,
} from './authentication'
import {
  mockAuth,
  mockedUser,
  restoreMockAuth,
} from './__custom_mocks__/firebase/auth'

describe('authentication', () => {
  it('should have default auth$ can subscribe and unsubscribe', async () => {
    expect(auth$.value).toStrictEqual({
      pending: false,
      error: undefined,
      sessionToken: null,
    })
  })

  describe('login', () => {
    it('should be able to login successfully, then logout', (done) => {
      login(credentials.username, credentials.password)

      expect(auth$.value).toStrictEqual({
        sessionToken: null,
        error: undefined,
        pending: true,
      })

      updateUserLogin(mockedUser.user)

      setTimeout(() => {
        expect(auth$.value).toStrictEqual({
          sessionToken: 'testToken',
          error: undefined,
          pending: false,
        })
        logout().then(() => {
          expect(auth$.value).toStrictEqual({
            pending: false,
            error: undefined,
            sessionToken: null,
          })
          done()
        })
      }, 200)
    })

    it('should be able fail to login, and still triggers logout', (done) => {
      login('invaliduser', 'invalidpassword')
      expect(auth$.value).toStrictEqual({
        sessionToken: null,
        error: undefined,
        pending: true,
      })

      setTimeout(() => {
        expect(auth$.value).toStrictEqual({
          sessionToken: null,
          error: 'Invalid user or password',
          pending: false,
        })
        logout().then(() => {
          updateUserLogin(null)
          expect(auth$.value).toStrictEqual({
            pending: false,
            error: undefined,
            sessionToken: null,
          })
          done()
        })
      }, 200)
    })

    it("should skip double relogin relogin when it's pending", () => {
      login('invaliduser', 'invalidpassword')
      login('invaliduser', 'invalidpassword')
      expect(auth$.value).toStrictEqual({
        sessionToken: null,
        error: undefined,
        pending: true,
      })
    })
  })

  describe('create', () => {
    it('should be able to create user successfully, then logout', async () => {
      const response = await create(credentials.username, credentials.password)

      expect(response).toStrictEqual({
        isProfileUpdated: true,
        sessionToken: 'testToken',
        error: undefined,
        pending: false,
      })

      updateUserLogin(mockedUser.user)

      await logout()
      updateUserLogin(null)
      expect(auth$.value).toStrictEqual({
        pending: false,
        error: undefined,
        sessionToken: null,
      })
    })

    it('should not be able to create user with profile if user fail', async () => {
      const response = await create('failcreateuser', credentials.password)

      expect(response).toStrictEqual({
        isProfileUpdated: false,
        sessionToken: null,
        error: 'fail to create user.',
        pending: false,
      })
    })
  })

  describe('resetEmail', () => {
    it('should successfully send email for reset', async () => {
      const response = await resetEmail('email', 'password')
      expect(response).toStrictEqual({
        isSent: true,
        error: undefined,
      })
    })

    it('should fail to send email for reset', async () => {
      const response = await resetEmail('invalidUser', 'password')
      expect(response).toStrictEqual({
        isSent: false,
        error: 'unable to reset.',
      })
    })
  })

  describe('confirmPasswordResetEmail', () => {
    it('should successfully confirm reset', async () => {
      const response = await confirmPasswordResetEmail('code', 'password')
      expect(response).toStrictEqual({
        isChanged: true,
        error: undefined,
      })
    })

    it('should fail to reset', async () => {
      const response = await confirmPasswordResetEmail(
        'invalidCode',
        'password'
      )
      expect(response).toStrictEqual({
        isChanged: false,
        error: 'unable to change password.',
      })
    })
  })

  describe('changePassword', () => {
    it('should successfully change password', async () => {
      const response = await changePassword('old', 'new')
      expect(response).toStrictEqual({
        isChanged: true,
        error: undefined,
      })
    })

    it('should fail to change password', async () => {
      const response = await changePassword('failPassword', 'new')
      expect(response).toStrictEqual({
        isChanged: false,
        error: 'invalid password.',
      })
    })

    it('should fail when current user is not logged in', async () => {
      mockAuth.mockReturnValue({ currentUser: null })
      const response = await changePassword('old', 'new')
      expect(response).toStrictEqual({
        isChanged: false,
        error: 'User is not logged in.',
      })
      restoreMockAuth()
    })
  })

  describe('updateUserLogin', () => {
    it('should return user as logged in if user is valid', (done) => {
      updateUserLogin(mockedUser.user)
      setTimeout(() => {
        expect(auth$.value).toStrictEqual({
          sessionToken: 'testToken',
          error: undefined,
          pending: false,
        })
        done()
      }, 200)
    })

    it('should return logged out after user is logged in', (done) => {
      updateUserLogin(null)
      setTimeout(() => {
        expect(auth$.value).toStrictEqual({
          sessionToken: null,
          error: undefined,
          pending: false,
        })
        done()
      }, 200)
    })
  })

  describe('removeUser', () => {
    it('should remove user successfully', async () => {
      restoreMockAuth()
      expect(await removeUser()).toStrictEqual({
        isRemoved: true,
        error: undefined,
      })
    })

    it('should handle if user cannot be removed', async () => {
      mockAuth.mockReturnValue({
        currentUser: null,
      })
      expect(await removeUser()).toStrictEqual({
        isRemoved: false,
        error: 'Firebase - Cannot remove user',
      })
    })
  })
})
