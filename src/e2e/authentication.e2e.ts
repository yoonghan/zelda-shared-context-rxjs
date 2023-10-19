import { create, login } from '../authentication'
import 'whatwg-fetch'

describe('authenticate', () => {
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
      error: 'Firebase: Error (auth/invalid-email).',
      sessionToken: null,
    })
  })
})
