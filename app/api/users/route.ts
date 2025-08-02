import { MongoClient } from 'mongodb'
import bcrypt from 'bcrypt'
import { getSession } from '@/auth';

const MONGO_URI = process.env.MONGO_URI as string;
const client = new MongoClient(MONGO_URI);
const dbName = process.env.DB_NAME as string

// export async function GET(request: Request) {
//     await client.connect();
//     const db = client.db(dbName);
//     const collection = db.collection('users');

//     const search = new URL(request.url)
//     const email = search.searchParams.get('email')

//     if(email) {
//         const user = await collection.findOne({email: email})
//         if(!user) {
//             return new Response(JSON.stringify({status: "user not found"}), {
//                 status: 404,
//                 headers: { 'Content-Type': 'application/json' }
//             });
//         }

//         return new Response(JSON.stringify({status: "ok", user: user}), {
//             status: 200,
//             headers: { 'Content-Type': 'application/json' }
//         });
//     } else {
//         const result = (await collection.find({}).toArray()).map(({password, ...rest}) => rest)

//         return new Response(JSON.stringify({status: "ok", result}), {
//             status: 200,
//             headers: { 'Content-Type': 'application/json' }
//         });
//     }
// }

//create new user
export async function POST(request: Request) {
    // const session = await getSession()
    // if(!session?.user) {
    //   return new Response(JSON.stringify({status: "access denied" }), {
    //     status: 403,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }
    
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');
    const body = await request.json()

    if(!body.name || !body.email || !body.password) {
        return new Response(JSON.stringify({status: "invalid parameters"}), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const user = await collection.findOne({email: body.email})
    if(user) {
        return new Response(JSON.stringify({status: "email already in use"}), {
            status: 409,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(body.password, saltRounds);

    const resultId = (await collection.insertOne({name: body.name, email: body.email, password: hash})).insertedId
    
    return new Response(JSON.stringify({status: "ok", user: {_id: resultId, name: body.name, email: body.email}}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

