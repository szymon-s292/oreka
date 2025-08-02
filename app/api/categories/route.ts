import { MongoClient, ObjectId } from 'mongodb'
import path from "path";
import fs from "fs";
import { getSession } from '@/auth';
import { uploadToBucket } from '@/app/external/bucket';

const MONGO_URI = process.env.MONGO_URI as string;

const client = new MongoClient(MONGO_URI);
const dbName = process.env.DB_NAME as string
const UPLOAD_DIR = process.env.ROOT_PATH as string + "public/uploads"

//get all categories
export async function GET() {
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
  const file = (body.image as File) || null;
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
    
    let photoURL = ""
    const { success, data } = await uploadToBucket([file])
    if(success) {
      photoURL = data.files[0].uri
      if(!photoURL) {
        return new Response(null, { status: 503 });
      }
    } else {
      return new Response(null, { status: 503 });
    }

    await collection.updateOne({_id: new ObjectId(result.insertedId)}, { $set: { photoURL: photoURL}}) 

    return new Response(JSON.stringify({status: "ok", _id: result.insertedId, imageURI: photoURL }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({status: "invalid parameters" }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
}