import { isValidObjectId } from 'mongoose';
import { MongoClient, ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
import { getSession } from '@/auth';

const MONGO_URI = process.env.MONGO_URI as string;
const client = new MongoClient(MONGO_URI);
const dbName = process.env.DB_NAME as string

//read user
// export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {


//     await client.connect();
//     const db = client.db(dbName);
//     const collection = db.collection('users');
//     const id = (await params).id;
    
//     if(!id || !isValidObjectId(id)) {
//         return new Response(JSON.stringify({status: "invalid parameters"}), {
//             status: 400,
//             headers: { 'Content-Type': 'application/json' }
//         });
//     }

//     const user = await collection.findOne({_id: new ObjectId(id)})
//     if(!user) {
//         return new Response(JSON.stringify({status: "user not found"}), {
//             status: 404,
//             headers: { 'Content-Type': 'application/json' }
//         });
//     }

//     return new Response(JSON.stringify({status: "ok", user: user}), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' }
//     });
// }

//update user
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if(!session?.user) {
      return new Response(JSON.stringify({status: "access denied" }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');
    const body = await request.json()

    const id = (await params).id;
    if(!id || !isValidObjectId(id)) {
        return new Response(JSON.stringify({status: "invalid parameters"}), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const user = await collection.findOne({_id: new ObjectId(id)})
    if(!user) {
        return new Response(JSON.stringify({status: "user not found"}), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const updateData: { [key: string]: any } = {};

    if (body.name)
        updateData.name = body.name; 

    if (body.email)
        updateData.email = body.email;
      
    const saltRounds = 10;
    if (body.password)
        updateData.password = await bcrypt.hash(body.password, saltRounds)
      
    await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );

    return new Response(JSON.stringify({status: "ok", user: {_id: user._id, ...body}}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

//delete user
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if(!session?.user) {
      return new Response(JSON.stringify({status: "access denied" }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');

    const id = (await params).id;
    if(!id || !isValidObjectId(id)) {
        return new Response(JSON.stringify({status: "invalid parameters"}), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const resultCount = (await collection.deleteOne({_id: new ObjectId(id)})).deletedCount

    if(resultCount === 0) {
        return new Response(JSON.stringify({status: "user not found"}), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify({status: "ok"}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}