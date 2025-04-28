import { MongoClient, ObjectId } from 'mongodb'
import { isValidObjectId } from 'mongoose';

const MONGO_URI = process.env.MONGO_URI as string;
const client = new MongoClient(MONGO_URI);
const dbName = process.env.DB_NAME as string

//read all/by category projects 
export async function GET(request: Request, { params }: { params: Promise<{ categoryId: string }> },) {
    const categoryId = (await params).categoryId;

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('projects');

    const result = isValidObjectId(categoryId) ? 
        await collection.find(({categoryId: new ObjectId(categoryId)})).toArray() :
        await collection.find(({})).toArray()

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
