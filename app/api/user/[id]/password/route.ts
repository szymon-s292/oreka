import { MongoClient, ObjectId } from 'mongodb'
import { isValidObjectId } from 'mongoose';
import bcrypt from "bcrypt"
import { getSession } from '@/auth';

const MONGO_URI = process.env.MONGO_URI as string;
const client = new MongoClient(MONGO_URI);
const dbName = process.env.DB_NAME as string

//update user's password
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> },) {
    const session = await getSession()
    if(!session?.user) {
      return new Response(JSON.stringify({status: "access denied" }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const id = (await params).id;
    const body = await request.json()

    if(!body.password || !isValidObjectId(id)) {
        return new Response(JSON.stringify({status: "invalid parameters"}), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    if(session?.user._id !== id) {
        return new Response(JSON.stringify({status: "access denied"}), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');
    
    const hash = await bcrypt.hash(body.password, 10)
    const result = await collection.updateOne({_id: new ObjectId(id)}, { $set: { password: hash } })
    
    if(result.modifiedCount === 0) {
        return new Response(JSON.stringify({status: "user not found"}), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify({status: "ok"}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}