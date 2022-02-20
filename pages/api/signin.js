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
    const data = req.body;
    const { userName, email } = data;

    var user = await db.collection('users').findOne({email: email, userName: userName});

    if (user != null) {
        res.status(200).json({status: 1, score: user.score});
    } else {
        res.status(200).json({status: 2, error: "This account doesn't exist"});
    }
}