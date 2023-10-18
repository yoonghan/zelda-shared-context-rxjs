import { credentials } from '../../__mocks__/const'

const testUsername = credentials.username
const testPassword = credentials.password

const firebaseAuth = {
  signInWithEmailAndPassword: async (
    auth: unknown,
    username: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    password: string
  ) => {
    if (username === testUsername && password === testPassword) {
      return {
        uid: 'testUid',
        username,
        user: {
          getIdToken: () =>
            new Promise((resolve) => {
              resolve('testToken')
            }),
        },
      }
    } else {
      throw Error('Invalid user or password')
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signOut: async (_auth: unknown) => {
    //auth()
  },
  getAuth: () => {},
}

jest.mock('firebase/auth', () => ({
  ...jest.mock('firebase/auth'),
  ...firebaseAuth,
}))

export default firebaseAuth
