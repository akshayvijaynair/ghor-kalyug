import db from "./../db/connection";

export interface UserDocument {
    username: string;
    quizzesTaken: {
        quizId: string;
        takenAt: Date;
    }[];
}

const userCollection = db.collection<UserDocument>("users");
export default userCollection;
