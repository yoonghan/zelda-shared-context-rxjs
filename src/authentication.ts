import { BehaviorSubject } from 'rxjs'
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  updateProfile,
  type UserCredential,
  type Auth,
} from 'firebase/auth'
import { Firebase } from './Firebase'
import { AuthResponse, AuthWithProfileResponse } from './type/Auth'
import { ChangePasswordResponse } from './type/ChangePassword'

export const SESSION_KEY = 'sessionToken'

export const auth$ = new BehaviorSubject<AuthResponse>({
  sessionToken: localStorage.getItem(SESSION_KEY),
  error: undefined,
  pending: false,
})

export async function create(
  username: string,
  password: string,
  displayName?: string
): Promise<AuthWithProfileResponse> {
  const loginResult = await loginOrCreate(
    createUserWithEmailAndPassword,
    username,
    password
  )

  let isProfileUpdated = false
  if (!loginResult.error) {
    await updateProfile(Firebase.getAuth().currentUser, {
      displayName: displayName || username,
    })
    isProfileUpdated = true
  }

  return { ...loginResult, isProfileUpdated }
}

export async function login(username: string, password: string) {
  return await loginOrCreate(signInWithEmailAndPassword, username, password)
}

export async function confirmPasswordResetEmail(
  code: string,
  newPassword: string
): Promise<ChangePasswordResponse> {
  try {
    await confirmPasswordReset(Firebase.getAuth(), code, newPassword)

    return {
      isChanged: true,
      error: undefined,
    }
  } catch (error) {
    return {
      isChanged: false,
      error: error.message,
    }
  }
}

export async function resetEmail(
  username: string,
  redirectUrl: string
): Promise<ChangePasswordResponse> {
  try {
    await sendPasswordResetEmail(Firebase.getAuth(), username, {
      url: redirectUrl,
    })

    return {
      isChanged: true,
      error: undefined,
    }
  } catch (error) {
    return {
      isChanged: false,
      error: error.message,
    }
  }
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> {
  const currentUser = Firebase.getAuth().currentUser
  if (currentUser === null) {
    return {
      isChanged: false,
      error: 'User is not logged in.',
    }
  }
  try {
    const userCredential = await reauthenticateWithCredential(
      currentUser,
      EmailAuthProvider.credential(currentUser.email, oldPassword)
    )
    const result = {
      sessionToken: await userCredential.user.getIdToken(false),
      error: undefined,
      pending: false,
    }
    auth$.next(result)
    localStorage.setItem(SESSION_KEY, result.sessionToken)
    await updatePassword(currentUser, newPassword)
    return {
      isChanged: true,
      error: undefined,
    }
  } catch (error) {
    return {
      isChanged: false,
      error: error.message,
    }
  }
}

async function loginOrCreate(
  fn: (auth: Auth, email: string, password: string) => Promise<UserCredential>,
  username: string,
  password: string
): Promise<AuthResponse> {
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

export async function logout() {
  await signOut(Firebase.getAuth())
  localStorage.removeItem(SESSION_KEY)
  auth$.next({
    sessionToken: null,
    error: undefined,
    pending: false,
  })
}
