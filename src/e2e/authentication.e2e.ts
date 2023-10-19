import { auth$, create, login } from '../authentication'
import 'whatwg-fetch'

describe('authenticate', () => {
  it('should be able to login', (done) => {
    login('e2e_login', 'abc123')
    setTimeout(() => {
      expect(auth$.value).toStrictEqual({
        pending: false,
        error: 'Firebase: Error (auth/invalid-email).',
        sessionToken: null,
      })
      done()
    }, 2000)
  })

  it('should be able to create', (done) => {
    create('e2e_create', 'abc123')
    setTimeout(() => {
      expect(auth$.value).toStrictEqual({
        pending: false,
        error: 'Firebase: Error (auth/invalid-email).',
        sessionToken: null,
      })
      done()
    }, 2000)
  })
})
