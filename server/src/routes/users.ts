import express, { Request, Response, NextFunction } from 'express';
import {auth, db } from '../firebaseAdmin'; 
import admin from '../firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';
const router = express.Router();
// Register Endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
      const { email, password, username } = req.body;

      // Create user in Firebase Auth
      const userRecord = await admin.auth().createUser({ email, password });

      // Store additional user data in Firestore
      await db.collection('users').doc(userRecord.uid).set({
          username,
          email,
      });

       res.status(200).json({ message: 'User registered successfully!' });
      
  } catch (error: any) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: error.message });
  }
});

router.post('/login', (req: Request, res: Response) => {
  res.status(200).send('Login route working');
});
export default router;