import { BehaviorSubject } from 'rxjs'
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  type UserCredential,
  type Auth,
} from 'firebase/auth'
import { Firebase } from './Firebase'

type AuthProps = {
  sessionToken: string | null
  error: string | undefined
  pending: boolean
}

export const SESSION_KEY = 'sessionToken'

export const auth$ = new BehaviorSubject<AuthProps>({
  sessionToken: localStorage.getItem(SESSION_KEY),
  error: undefined,
  pending: false,
})

export function create(username: string, password: string) {
  loginOrCreate(createUserWithEmailAndPassword, username, password)
}

export function login(username: string, password: string) {
  loginOrCreate(signInWithEmailAndPassword, username, password)
}

function loginOrCreate(
  fn: (auth: Auth, email: string, password: string) => Promise<UserCredential>,
  username: string,
  password: string
) {
  if (!auth$.value.pending) {
    auth$.next({
      sessionToken: null,
      error: undefined,
      pending: true,
    })

    fn(Firebase.getAuth(), username, password)
      .then((userCredential) => {
        const user = userCredential.user
        user.getIdToken(false).then((idToken) => {
          localStorage.setItem(SESSION_KEY, idToken)
          auth$.next({
            sessionToken: idToken,
            error: undefined,
            pending: false,
          })
        })
      })
      .catch((error) => {
        auth$.next({
          sessionToken: null,
          error: error.message,
          pending: false,
        })
      })
  }
}

export function logout() {
  signOut(Firebase.getAuth())
  localStorage.removeItem(SESSION_KEY)
  auth$.next({
    sessionToken: null,
    error: undefined,
    pending: false,
  })
}
