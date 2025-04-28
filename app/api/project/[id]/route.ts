import { MongoClient, ObjectId } from 'mongodb'
import { isObjectIdOrHexString, isValidObjectId } from 'mongoose';
import path from "path";
import fs from "fs";
import { ProjectResource } from '@/app/types/types';
import { getSession } from '@/auth';

const MONGO_URI = process.env.MONGO_URI as string;
const client = new MongoClient(MONGO_URI);
const dbName = process.env.DB_NAME as string
const APP_DIR = process.env.ROOT_PATH as string

//read project - no auth 
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> },) {
    const id = (await params).id;

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('projects');

    if(!isValidObjectId(id)) {
      return new Response(JSON.stringify({status: "invalid parameters"}), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await collection.findOne(({_id: new ObjectId(id)}))

    if(!result) {
      return new Response(JSON.stringify({status: "invalid parameters"}), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

//update project
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if(!session?.user) {
      return new Response(JSON.stringify({status: "access denied" }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  
    const projectId = (await params).id
    const formData = await request.formData()
    const body = Object.fromEntries(formData)

    const name = (body.projectName as string) || null
    const description = (body.projectDescription as string) || null
    const categoryId = (body.projectCategory as string) || null

    const fileMap = (JSON.parse(body.fileMap as string)) || []
    const imageMap = (JSON.parse(body.imageMap as string)) || []

    if(!name || !description || !categoryId || !isObjectIdOrHexString(categoryId)) {
      return new Response(JSON.stringify({status: "invalid parameters" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await client.connect();
    const db = client.db(dbName);
    const categories = db.collection('categories');
    const category = await categories.findOne({ _id: new ObjectId(categoryId) });

    if (!category) {
      return new Response(JSON.stringify({status: "invalid project category" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const filesPath = `${APP_DIR}public/uploads/project/${projectId}`
    fs.rmSync(filesPath, { recursive: true, force: true });
    fs.mkdirSync(filesPath, {recursive: true})

    const files: ProjectResource[] = []
    for (let i = 0; i < fileMap.length; i++) {
      const file = body[fileMap[i]] as File;
      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const ext = file.name.split(".").at(-1)
        fs.writeFileSync(
          path.resolve(filesPath, `file-${i + 1}.${ext}`),
          buffer
        )

        files.push({url: `/uploads/project/${projectId}/file-${i + 1}.${ext}`, name: file.name})
      }
    }
    
    const images: ProjectResource[] = []
    for (let i = 0; i < imageMap.length; i++) {
        const file = body[imageMap[i]] as File;
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer())
            const ext = file.name.split(".").at(-1)

            fs.writeFileSync(
                path.resolve(filesPath, `image-${i + 1}.${ext}`),
                buffer
            )

            images.push({url: `/uploads/project/${projectId}/image-${i + 1}.${ext}`, name: file.name})
        }
    }

    const projects = db.collection('projects');
    await projects.updateOne({_id: new ObjectId(projectId)}, { $set: {
      name: name,
      description: description, 
      categoryId: new ObjectId(categoryId), 
      images: images,
      files: files
    }})

  return new Response(JSON.stringify({status: "ok", projectId: projectId, projectCategory: categoryId, images: images, files: files}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
  });
}

//delete project
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if(!session?.user) {
    return new Response(JSON.stringify({status: "access denied" }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const projectId = (await params).id

  if(!isObjectIdOrHexString(projectId)) {
    return new Response(JSON.stringify({status: "invalid id" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  await client.connect();
  const db = client.db(dbName);
  const categories = db.collection('projects');
  const project = await categories.deleteOne({ _id: new ObjectId(projectId) });
  
  const filesPath = `${APP_DIR}public/uploads/project/${projectId}`
  if(fs.existsSync(filesPath))
    fs.rmSync(filesPath, { recursive: true, force: true });
  console.log(project)

  if(project.deletedCount == 0) {
    return new Response(JSON.stringify({status: "invalid parameters" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({status: "ok", projectId: projectId}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}