import './__custom_mocks__/firebase/auth'
import { credentials } from './__custom_mocks__/const'
import {
  auth$,
  changePassword,
  confirmPasswordResetEmail,
  create,
  getUserAdditionalInfo,
  login,
  logout,
  removeUser,
  resetEmail,
  updateUser,
  updateUserAdditionalInfo,
  updateUserLogin,
} from './authentication'
import {
  mockedUser,
  nullMockAuth,
  restoreMockAuth,
} from './__custom_mocks__/firebase/auth'

describe('authentication', () => {
  it('should have default auth$ can subscribe and unsubscribe', async () => {
    expect(auth$.value).toStrictEqual({
      displayName: null,
      pending: false,
      error: undefined,
      sessionToken: null,
    })
  })

  describe('login', () => {
    it('should be able to login successfully, then logout', (done) => {
      login(credentials.username, credentials.password)

      expect(auth$.value).toStrictEqual({
        displayName: null,
        sessionToken: null,
        error: undefined,
        pending: true,
      })

      updateUserLogin(mockedUser.user)

      setTimeout(() => {
        expect(auth$.value).toStrictEqual({
          displayName: 'Andy',
          sessionToken: 'testToken',
          error: undefined,
          pending: false,
        })
        logout().then(() => {
          expect(auth$.value).toStrictEqual({
            displayName: null,
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
        displayName: null,
        sessionToken: null,
        error: undefined,
        pending: true,
      })

      setTimeout(() => {
        expect(auth$.value).toStrictEqual({
          displayName: null,
          sessionToken: null,
          error: 'Invalid user or password',
          pending: false,
        })
        logout().then(() => {
          updateUserLogin(null)
          expect(auth$.value).toStrictEqual({
            displayName: null,
            pending: false,
            error: undefined,
            sessionToken: null,
          })
          done()
        })
      }, 200)
    })

    it("should skip double relogin when it's pending", () => {
      login('someuser', 'somepassword')
      login('someuser', 'somepassword')
      expect(auth$.value).toStrictEqual({
        displayName: null,
        sessionToken: null,
        error: undefined,
        pending: true,
      })
    })

    it("should skip double create when it's pending", () => {
      create('someuser', 'somepassword')
      create('someuser', 'somepassword')
      expect(auth$.value).toStrictEqual({
        displayName: null,
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
        displayName: credentials.username,
        isProfileUpdated: true,
        sessionToken: 'testToken',
        error: undefined,
        pending: false,
      })

      updateUserLogin(mockedUser.user)

      await logout()
      updateUserLogin(null)
      expect(auth$.value).toStrictEqual({
        displayName: null,
        pending: false,
        error: undefined,
        sessionToken: null,
      })
    })

    it('should not be able to create user with profile if user fail', async () => {
      const response = await create('failcreateuser', credentials.password)

      expect(response).toStrictEqual({
        displayName: null,
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
      nullMockAuth()
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
          displayName: 'Andy',
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
          displayName: null,
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
      expect(await removeUser()).toStrictEqual({
        isRemoved: true,
        error: undefined,
      })
    })

    it('should handle if user cannot be removed', async () => {
      nullMockAuth()
      expect(await removeUser()).toStrictEqual({
        isRemoved: false,
        error: 'Firebase - Cannot remove user.',
      })
    })
  })

  describe('updateUser', () => {
    it('should be able to update user', (done) => {
      const updatedName = 'micheal jackson'
      updateUser({ displayName: updatedName }).then((response) => {
        expect(response).toStrictEqual({
          isProfileUpdated: true,
          error: undefined,
        })

        setTimeout(() => {
          expect(auth$.value.displayName).toBe(updatedName)
        }, 200)
        done()
      })
    })

    it('should handle if user cannot be updated', async () => {
      nullMockAuth()
      expect(await updateUser({ displayName: 'invalidUser' })).toStrictEqual({
        isProfileUpdated: false,
        error: 'Firebase - Cannot update user.',
      })
    })
  })

  describe('updateUserAdditionalInfo', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    const sampleInfo = {
      contacts: [{ phoneNumber: 123 }],
      mailingAddress: { address: 'Balister Rd' },
      preferences: { theme: 'dark' },
    }

    it('should store userinfo', async () => {
      const result = await updateUserAdditionalInfo(sampleInfo)
      expect(result.isAdditionaUserInfoUpdated).toBeTruthy()
    })

    it('can override and store partial userinfo', async () => {
      await updateUserAdditionalInfo(sampleInfo)

      const result2 = await updateUserAdditionalInfo({
        preferences: { theme: 'light' },
      })

      expect(result2.isAdditionaUserInfoUpdated).toBeTruthy()
      expect(await getUserAdditionalInfo()).toStrictEqual({
        ...sampleInfo,
        preferences: { theme: 'light' },
      })
    })
  })
})
