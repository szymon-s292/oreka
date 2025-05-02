import { MongoClient } from 'mongodb'
import { getSession } from '@/auth';

const MONGO_URI = process.env.MONGO_URI as string;
const client = new MongoClient(MONGO_URI);
const dbName = process.env.DB_NAME as string

//get all articles
export async function GET() {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('articles');
  const categories = await collection.find({}).toArray()
  
  return new Response(JSON.stringify(categories), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

//create new article
export async function POST(request: Request) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  const content = (body.content as Blob) || null;
  const title = (body.title as string) || null;

  const session = await getSession()
  if(!session?.user) {
    return new Response(JSON.stringify({status: "access denied" }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!content || !title) {
    return new Response(JSON.stringify({status: "invalid parameters" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('articles');
  const result = await collection.insertOne({title: title, content: content, author: session.user.name})

  return new Response(JSON.stringify({status: "ok", _id: result.insertedId}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}