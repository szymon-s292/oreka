import { MongoClient, ObjectId } from 'mongodb'
import { isObjectIdOrHexString } from 'mongoose';
import path from "path";
import fs from "fs";
import { getSession } from '@/auth';

const MONGO_URI = process.env.MONGO_URI as string;
const client = new MongoClient(MONGO_URI);
const dbName = process.env.DB_NAME as string
const UPLOAD_DIR = process.env.ROOT_PATH as string + "public/uploads"

//update category
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> },) {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    const file = (body.image as Blob) || null;
    const name = (body.name as string) || null;
    const id = (await params).id;

    const session = await getSession()
    if(!session?.user) {
      return new Response(JSON.stringify({status: "access denied" }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if(!isObjectIdOrHexString(id))
      return new Response(JSON.stringify({status: "category with this id does not exist" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('categories');
    const category = await collection.findOne({ _id: new ObjectId(id) });

    if (!category) {
      return new Response(JSON.stringify({status: "category with this id does not exist" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR);
      }

      const fileExt = (file as File).name.split(".").at(-1)
      const fileName = `category-${id}-image.${fileExt}`

      fs.writeFileSync(
        path.resolve(UPLOAD_DIR, fileName),
        buffer
      );

      await collection.updateOne({_id: new ObjectId(id)}, { $set: {photoURL: `/uploads/${fileName}`}})
    }

    if(name) {
      await collection.updateOne({_id: new ObjectId(id)}, { $set: {name: name}})
      return new Response(JSON.stringify({status: "ok", updatedID: id, updatedName: name}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({status: "invalid parameters" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
}

//delete category
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  const session = await getSession()
  if(!session?.user) {
    return new Response(JSON.stringify({status: "access denied" }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if(!isObjectIdOrHexString(id))
    return new Response(JSON.stringify({status: "category with this id does not exist" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });

  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('categories');

  const category = await collection.findOne({ _id: new ObjectId(id) });

  if (category)
  {
    const deleteResult = await collection.deleteOne({ _id: new ObjectId(id)});
    const fileName = `category-${id}-image.${category.photoURL.split(".").at(-1)}`
    fs.unlink(`${UPLOAD_DIR}/${fileName}`, () => {})

    const projects = db.collection('projects');
    const projectIdsToDelete = await projects.find({categoryId: new ObjectId(id)}).toArray()

    for (const projectId of projectIdsToDelete) {
      const toDelete = path.join(UPLOAD_DIR, 'project', projectId._id.toString());
  
      if (fs.existsSync(toDelete)) {
        fs.rm(toDelete, { recursive: true, force: true }, (err) => {
          if (err) {
            console.error(`Error deleting ${toDelete}:`, err);
          } else {
            console.log(`Deleted: ${toDelete}`);
          }
        });
      }
    }

    await projects.deleteMany({categoryId: new ObjectId(id)})

    if (deleteResult.deletedCount === 1) {
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response(JSON.stringify({ status: "category with this id does not exist" }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
}
