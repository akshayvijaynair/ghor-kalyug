import admin from "./firebaseAdmin";
import { Request, Response, NextFunction } from "express";
import { DecodedIdToken } from 'firebase-admin/auth';

export async function verifyFirebaseToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    // Ensure Firebase Admin is initialized before verifying token
    if (admin.apps.length === 0) {
      throw new Error("Firebase Admin not initialized");
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Firebase token verification error:", error);
    return res.status(403).json({ 
      error: "Unauthorized: Invalid token",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}