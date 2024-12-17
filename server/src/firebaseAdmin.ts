import admin from "firebase-admin";

const serviceAccount = require("../config/ghor-kalyug-firebase-adminsdk-69inp-813d124000.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const auth = admin.auth();
export const db = admin.firestore();
export default admin;