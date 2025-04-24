import { MongoClient, ObjectId } from 'mongodb'
import path from "path";
import fs from "fs";
import { getSession } from '@/app/auth';

const MONGO_URI = process.env.MONGO_URI as string;
const client = new MongoClient(MONGO_URI);
const dbName = process.env.DB_NAME as string
const UPLOAD_DIR = process.env.ROOT_PATH as string + "public/uploads"

//get all categories
export async function GET(request: Request) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('categories');
  const categories = await collection.find({}).toArray()
  
  return new Response(JSON.stringify(categories), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

//create new category
export async function POST(request: Request) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const file = (body.image as Blob) || null;
  const name = (body.name as string) || null;

  const session = await getSession()
  if(!session?.user) {
    return new Response(JSON.stringify({status: "access denied" }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (file && name) {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('categories');
    const result = await collection.insertOne({name: name, photoURL: ''})

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR);
    }

    const fileExt = (file as File).name.split(".").at(-1)
    const fileName = `category-${result.insertedId}-image.${fileExt}`

    fs.writeFileSync(
      path.resolve(UPLOAD_DIR, fileName),
      buffer
    );
    
    const updateResult = await collection.updateOne({_id: new ObjectId(result.insertedId)}, { $set: { photoURL: `/uploads/${fileName}`}}) 

    return new Response(JSON.stringify({status: "ok", _id: result.insertedId, imageURI: `/uploads/${fileName}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({status: "invalid parameters" }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
}