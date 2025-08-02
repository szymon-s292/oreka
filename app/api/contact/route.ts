import { MongoClient, ObjectId } from 'mongodb';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { getSession } from '@/auth';

const MONGO_URI = process.env.MONGO_URI as string;
const client = new MongoClient(MONGO_URI);
const dbName = process.env.DB_NAME as string;
const db = client.db(dbName);

const { window } = new JSDOM('');
const DOMPurifyInstance = DOMPurify(window);

//create new contact form submition - no auth
export async function POST(request: Request) {
  const collection = db.collection('contact')
  const body = await request.json()

  const firstName = DOMPurifyInstance.sanitize(body?.firstName)
  const lastName = DOMPurifyInstance.sanitize(body?.lastName)
  const phone = DOMPurifyInstance.sanitize(body?.phone)
  const email = DOMPurifyInstance.sanitize(body?.email)
  const message = DOMPurifyInstance.sanitize(body?.message)
  const time = DOMPurifyInstance.sanitize(body?.time)

  const { insertedId } = await collection.insertOne({firstName, lastName, phone, email, message, time });
  
  return new Response(JSON.stringify({status: "ok", id: insertedId}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

//read list of contact form submitions
export async function GET() {
  const session = await getSession()
  if(!session?.user) {
    return new Response(JSON.stringify({status: "access denied" }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const collection = db.collection('contact')

  const contacts = await collection.find({}).toArray()
    
  return new Response(JSON.stringify(contacts), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

//delete contact form submition
export async function DELETE(request: Request) {
  const session = await getSession()
  if(!session?.user) {
    return new Response(JSON.stringify({status: "access denied" }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const collection = db.collection('contact')
  const body = await request.json()
  const { id } = body
  const idToDelete: string = id;
  const objectId = new ObjectId(idToDelete);

  await collection.deleteOne({ "_id": objectId });

  return new Response(JSON.stringify({status: "ok", id: idToDelete}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
