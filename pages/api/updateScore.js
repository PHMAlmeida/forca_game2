import { MongoClient, Db} from 'mongodb'

const jwt = require("jsonwebtoken");

async function connectDb(uri) {
    const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

    const db = client.db("forca");
    return db;
}

export default async (req, res) => {
    const db = await connectDb(process.env.MONGODB_URI);
    const { userEmail, score } = req.body;

    await db.collection('users').updateOne(
        { "email" : userEmail },
        { $set: { "score" : score } }
    );
    res.status(200).json({status: 2, email: userEmail});
}