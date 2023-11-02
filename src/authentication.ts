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
  deleteUser,
  type UserCredential,
  type Auth,
} from 'firebase/auth'
import { Firebase } from './Firebase'
import { AuthResponse, AuthWithProfileResponse } from './type/Auth'
import {
  ChangePasswordResponse,
  EmailPasswordResetResponse,
} from './type/ChangePassword'
import { RemoveUser } from './type/RemoveUser'

export const SESSION_KEY = 'sessionToken'
export const DISPLAYNAME_KEY = 'sessionToken'

const updateToken = (idToken: string, displayName: string) => {
  const result = {
    sessionToken: idToken,
    displayName: displayName,
    error: undefined,
    pending: false,
  }
  localStorage.setItem(SESSION_KEY, idToken)
  localStorage.setItem(DISPLAYNAME_KEY, displayName)
  auth$.next(result)
  return result
}

export const auth$ = new BehaviorSubject<AuthResponse>({
  sessionToken: localStorage.getItem(SESSION_KEY),
  displayName: localStorage.getItem(DISPLAYNAME_KEY),
  error: undefined,
  pending: false,
})

export async function create(
  username: string,
  password: string,
  displayName?: string
): Promise<AuthWithProfileResponse> {
  const definedDisplayName = displayName || username
  const createResult = await loginOrCreate(
    createUserWithEmailAndPassword,
    username,
    password
  )

  if (!createResult.error) {
    const loginResult = await login(username, password)

    await updateProfile(Firebase.getAuth().currentUser, {
      displayName: definedDisplayName,
    })

    return {
      ...loginResult,
      displayName: definedDisplayName,
      isProfileUpdated: true,
    }
  }

  return { ...createResult, isProfileUpdated: false }
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
): Promise<EmailPasswordResetResponse> {
  try {
    await sendPasswordResetEmail(Firebase.getAuth(), username, {
      url: redirectUrl,
    })

    return {
      isSent: true,
      error: undefined,
    }
  } catch (error) {
    return {
      isSent: false,
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
    updateToken(
      await userCredential.user.getIdToken(false),
      userCredential.user.displayName
    )
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
    auth$.next({
      sessionToken: null,
      displayName: null,
      error: undefined,
      pending: true,
    })

    try {
      const userCredential = await fn(Firebase.getAuth(), username, password)
      return updateToken(
        await userCredential.user.getIdToken(false),
        userCredential.user.displayName
      )
    } catch (error) {
      const result = {
        sessionToken: null,
        displayName: null,
        error: error.message,
        pending: false,
      }
      auth$.next(result)
      return result
    }
  }
}

export async function logout() {
  await signOut(Firebase.getAuth())
  updateUserLogin(undefined)
}

export const updateUserLogin = (user) => {
  if (!user) {
    localStorage.removeItem(SESSION_KEY)
    auth$.next({
      sessionToken: null,
      displayName: null,
      error: undefined,
      pending: false,
    })
  } else {
    user.getIdToken(false).then((idToken) => {
      updateToken(idToken, user.displayName)
    })
  }
}

export async function removeUser(): Promise<RemoveUser> {
  try {
    await deleteUser(Firebase.getAuth().currentUser)
    return {
      isRemoved: true,
      error: undefined,
    }
  } catch (error) {
    return {
      isRemoved: false,
      error: error.message,
    }
  }
}

function init() {
  Firebase.getAuth().onAuthStateChanged(updateUserLogin)
}
init()
