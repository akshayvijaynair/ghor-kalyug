import admin from "firebase-admin";
import dotenv from "dotenv";
import serviceAccount from "./serviceAccountKey.json";

dotenv.config();

try {
  // Check if the app is already initialized to prevent re-initialization
  if (admin.apps.length === 0) {
    // Initialize Firebase Admin with the service account key directly from the JSON file
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });

    console.log("Firebase Admin initialized successfully");
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
}

export const auth = admin.auth();
export const db = admin.firestore();
export default admin;
