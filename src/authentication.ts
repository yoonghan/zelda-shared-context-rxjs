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

export async function create(username: string, password: string) {
  return await loginOrCreate(createUserWithEmailAndPassword, username, password)
}

export async function login(username: string, password: string) {
  return await loginOrCreate(signInWithEmailAndPassword, username, password)
}

async function loginOrCreate(
  fn: (auth: Auth, email: string, password: string) => Promise<UserCredential>,
  username: string,
  password: string
): Promise<AuthProps> {
  if (!auth$.value.pending) {
    let result = {
      sessionToken: null,
      error: undefined,
      pending: true,
    }

    auth$.next(result)

    try {
      const userCredential = await fn(Firebase.getAuth(), username, password)
      const user = userCredential.user
      const idToken = await user.getIdToken(false)

      result = {
        sessionToken: idToken,
        error: undefined,
        pending: false,
      }
      localStorage.setItem(SESSION_KEY, idToken)
    } catch (error) {
      result = {
        sessionToken: null,
        error: error.message,
        pending: false,
      }
    }

    auth$.next(result)
    return result
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
