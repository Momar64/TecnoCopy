import { MongoClient } from "mongodb";
const uri = process.env.DATABASE_URL;
var client;
var clientPromise;
// if (process.env.NODE_ENV === 'development') {
//     // In development mode, use a global variable so that the value
//     // is preserved across module reloads caused by HMR (Hot Module Replacement).
//     if (!global._mongoClientPromise) {
//         client = new MongoClient(uri)
//         global._mongoClientPromise = client.connect()
//     }
//     clientPromise = global._mongoClientPromise
// } else {
// In production mode, it's best to not use a global variable.
client = new MongoClient(uri);
clientPromise = await client.connect();
// }
export default clientPromise;
