import { initializeApp } from 'firebase/app'
import { getAuth as getFirebaseAuth } from 'firebase/auth'

export class Firebase {
  static getFirebaseInitializeApp = () => {
    return initializeApp({
      apiKey: 'AIzaSyAIxjOdlqnnLTrNHgu-rBvaFYLehqcSMaQ',
      authDomain: 'walcron-8bef6.firebaseapp.com',
      databaseURL:
        'https://walcron-8bef6-default-rtdb.asia-southeast1.firebasedatabase.app',
      projectId: 'walcron-8bef6',
      storageBucket: 'walcron-8bef6.appspot.com',
      messagingSenderId: '460553236441',
      appId: '1:460553236441:web:973e33679327688d5c73c8',
    })
  }

  public static getAuth = () => getFirebaseAuth(this.getFirebaseInitializeApp())
}
