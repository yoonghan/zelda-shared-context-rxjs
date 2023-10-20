import './__custom_mocks__/firebase/auth'
import { credentials } from './__custom_mocks__/const'
import { auth$, create, login, logout } from './authentication'

describe('authentication', () => {
  it('should have default auth$ can subscribe and unsubscribe', async () => {
    expect(auth$.value).toStrictEqual({
      pending: false,
      error: undefined,
      sessionToken: null,
    })
  })

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

  it('should be able to create user successfully, then logout', (done) => {
    create(credentials.username, credentials.password)

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
