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
    const { userName, email, score } = data;

    const collection = db.collection('users');

    var userEmail = await db.collection('users').findOne({email: email});
    var userUserName = await db.collection('users').findOne({userName: userName});
    
    if (userEmail != null) {
        console.log(userEmail);
        res.status(200).json({status: 2, error: "This email already exists"});
    } else if (userUserName != null) {
        res.status(200).json({status: 3, error: "This userName already exists"});
    } else {
        res.status(200).json({status: 1, score: score});
        await collection.insertOne(data);
    }

}