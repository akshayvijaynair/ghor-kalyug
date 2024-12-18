import express, { Request, Response, NextFunction } from 'express';

import admin from '../firebaseAdmin';
import db from '../db/connection';
const router = express.Router();
// Register Endpoint
//@ts-ignore
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Step 1: Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Step 2: Store user in MongoDB
    const mongoCollection = db.collection('users');
    await mongoCollection.insertOne({
      uid: userRecord.uid, // Firebase UUID
      email,
      username,
      createdAt: new Date(),
    });

    // Step 3: Optionally save data in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      username,
      email,
    });

    res.status(200).json({ message: 'User registered successfully!', uid: userRecord.uid });
  } catch (error: any) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: error.message });
  }
});
export default router;