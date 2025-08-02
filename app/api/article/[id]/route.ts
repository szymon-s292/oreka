import { MongoClient, ObjectId } from 'mongodb'
import { getSession } from '@/auth';
import { isValidObjectId } from 'mongoose';

const MONGO_URI = process.env.MONGO_URI as string;
const client = new MongoClient(MONGO_URI);
const dbName = process.env.DB_NAME as string

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const id = (await params).id
  const content = (body.content as Blob) || null;
  const title = (body.title as string) || null;

  const session = await getSession()
  if(!session?.user) {
    return new Response(JSON.stringify({status: "access denied" }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!content || !title || !isValidObjectId(id)) {
    return new Response(JSON.stringify({status: "invalid parameters" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('articles');
  const result = await collection.updateOne({_id: new ObjectId(id)}, { $set: {title: title, content: content, author: session.user.name}})

  return new Response(JSON.stringify({status: "ok", _id: id}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    const session = await getSession()
    if(!session?.user) {
      return new Response(JSON.stringify({status: "access denied" }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  
    if (!isValidObjectId(id)) {
      return new Response(JSON.stringify({status: "invalid parameters" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('articles');
    const result = await collection.deleteOne({_id: new ObjectId(id)})

    return new Response(JSON.stringify({status: "ok", _id: id}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
}