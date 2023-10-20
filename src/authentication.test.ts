import './__custom_mocks__/firebase/auth'
import { credentials } from './__custom_mocks__/const'
import {
  auth$,
  confirmPasswordResetEmail,
  create,
  login,
  logout,
  resetEmail,
} from './authentication'

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
      await logout()
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
        isChanged: true,
        error: undefined,
      })
    })

    it('should fail to send email for reset', async () => {
      const response = await resetEmail('invalidUser', 'password')
      expect(response).toStrictEqual({
        isChanged: false,
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
})
