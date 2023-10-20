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
      uid: 'testUid',
      username,
      user: {
        getIdToken: () =>
          new Promise((resolve) => {
            resolve('testToken')
          }),
      },
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
  signOut: async (_auth: unknown) => {},
  getAuth: () => ({
    currentUser: 'han',
  }),
  updateProfile: () => {},
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
}))
