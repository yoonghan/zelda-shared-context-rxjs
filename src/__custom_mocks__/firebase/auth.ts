export const mockedUser = {
  uid: 'testUid',
  username: 'test user',
  user: {
    getIdToken: () =>
      new Promise((resolve) => {
        resolve('testToken')
      }),
    displayName: 'Andy',
  },
}

const mockAuth = jest.fn()
export const restoreMockAuth = () => {
  mockAuth.mockReturnValue({
    currentUser: 'han',
    onAuthStateChanged: (func) => {
      func()
    },
  })
}
export const nullMockAuth = () => {
  mockAuth.mockReturnValue({
    currentUser: null,
  })
}
restoreMockAuth()

jest.mock('firebase/auth', () => ({
  ...jest.mock('firebase/auth'),
  createUserWithEmailAndPassword: async (
    auth: unknown,
    username: string
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ) => {
    if (username === 'failcreateuser') {
      throw new Error('fail to create user.')
    }
    return {
      ...mockedUser,
      username,
    }
  },
  signInWithEmailAndPassword: async (
    auth: unknown,
    username: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    password: string
  ) => {
    if (
      username === 'walcoorperation@gmail.com' &&
      password === 'samplePassword'
    ) {
      return { ...mockedUser, username }
    } else {
      throw Error('Invalid user or password')
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signOut: async (_auth: unknown) => {},
  getAuth: mockAuth,
  updateProfile: (_auth, profile: { displayName: string }) => {
    if (profile.displayName === 'invalidUser') {
      throw Error('Firebase - Cannot update user.')
    }
  },
  sendPasswordResetEmail: async (_auth: unknown, username: string) => {
    if (username === 'invalidUser') {
      throw Error('unable to reset.')
    }
  },
  confirmPasswordReset: async (_auth: unknown, code: string) => {
    if (code === 'invalidCode') {
      throw Error('unable to change password.')
    }
  },
  EmailAuthProvider: {
    credential: (_username: string, password) => {
      if (password === 'failPassword') {
        throw new Error('invalid password.')
      }
    },
  },
  reauthenticateWithCredential: async () => {
    return {
      uid: 'testUid',
      username: 'testUser',
      user: {
        getIdToken: () =>
          new Promise((resolve) => {
            resolve('testToken')
          }),
      },
    }
  },
  updatePassword: async () => {},
  deleteUser: async (user: unknown) => {
    if (!user) {
      throw new Error('Firebase - Cannot remove user.')
    } else {
      return {}
    }
  },
}))
