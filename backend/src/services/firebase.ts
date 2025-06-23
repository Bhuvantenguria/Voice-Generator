import * as admin from 'firebase-admin'
import { config } from '../config'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebase.projectId,
      clientEmail: config.firebase.clientEmail,
      privateKey: config.firebase.privateKey,
    }),
    storageBucket: `${config.firebase.projectId}.appspot.com`,
  })
}

export const auth = admin.auth()
export const firestore = admin.firestore()
export const storage = admin.storage() 