import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";
const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri as string);

/*try {
    await client.connect();
    await client.db("quizApp").command({ ping: 1 });
    console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
    );
} catch(err) {
    console.error(err);
}*/

let db = client.db("quizApp");
export default db;