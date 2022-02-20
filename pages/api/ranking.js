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

    const data = await db.collection('users').find({}).sort({score:-1}).toArray();
    console.log(data);
    res.status(200).json(data);
}