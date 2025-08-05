import { MongoClient, ObjectId } from 'mongodb'
import { isObjectIdOrHexString } from 'mongoose';
import path from "path";
import fs from "fs";
import { getSession } from '@/auth';
import { deleteFromBucket, updateInBucket, uploadToBucket } from "@/app/external/bucket";
import { Project } from '@/app/types/types';

const MONGO_URI = process.env.MONGO_URI as string;
const client = new MongoClient(MONGO_URI);
const dbName = process.env.DB_NAME as string
const UPLOAD_DIR = process.env.ROOT_PATH as string + "public/uploads"

//update category
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> },) {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    const file = (body.image as File) || null;
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

    const filename = category.photoURL?.split('/')?.at(-1)
    
    if (file) {
      const res = await updateInBucket(filename, file)
      const url = res.data.uri

      if (!url) {
        return new Response(JSON.stringify({ status: "internal error" }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      await collection.updateOne({_id: new ObjectId(id)}, { $set: {photoURL: url}})
    } else {
      if(filename) {
        const { success, data } = await deleteFromBucket([filename])
        if(!success) {
          return new Response(null, { status: 503 });
        }
      }
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

  if (category) {
    if(category.photoURL) {
      const filename = category.photoURL.split('/').at(-1)
      const { success, data } = await deleteFromBucket([filename])

      if(!success) {
        return new Response(null, { status: 503 });
      }
    }

    const projects = db.collection('projects');
    const projectsToDelete = (await projects.find({categoryId: new ObjectId(id)}).toArray()) as unknown as Project[]
    
    const filenames: string[] = []
    for (const project of projectsToDelete) {
      if(project.files) {
        for(const file of project.files) {
          filenames.push(file.url.split("/").at(-1) || "")
        }
      }
      if(project.images) {
        for(const file of project.images) {
          filenames.push(file.url.split("/").at(-1) || "")
        }
      }
    }

    if(filenames.length != 0) {
      const { success, data } = await deleteFromBucket(filenames)
      if(!success) {
        return new Response(null, { status: 503 });
      }
      await projects.deleteMany({categoryId: new ObjectId(id)})
    }
    
    await collection.deleteOne({ _id: new ObjectId(id)});

    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ status: "category with this id does not exist" }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
}
