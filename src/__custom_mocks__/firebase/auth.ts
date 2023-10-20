jest.mock('firebase/auth', () => ({
  ...jest.mock('firebase/auth'),
  createUserWithEmailAndPassword: async (
    auth: unknown,
    username: string
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ) => {
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
  signOut: async (_auth: unknown) => {
    return 'ok'
  },
  getAuth: () => ({
    currentUser: 'han',
  }),
  updateProfile: () => {},
}))
