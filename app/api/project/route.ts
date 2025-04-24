import { MongoClient, ObjectId } from 'mongodb'
import { isObjectIdOrHexString } from 'mongoose';
import path from "path";
import fs from "fs";
import { ProjectResource } from '@/app/types/types';
import { getSession } from '@/app/auth';

const MONGO_URI = process.env.MONGO_URI as string;
const client = new MongoClient(MONGO_URI);
const dbName = process.env.DB_NAME as string
const APP_DIR = process.env.ROOT_PATH as string

//create new project
export async function POST(request: Request) {

    const session = await getSession()
    if(!session?.user) {
      return new Response(JSON.stringify({status: "access denied" }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
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

    const projects = db.collection('projects');
    const result1 = await projects.insertOne({name: name, description: description, categoryId: new ObjectId(categoryId)})
    const projectId = result1.insertedId

    const filesPath = `${APP_DIR}public/uploads/project/${projectId}`
    if(!fs.existsSync(filesPath))
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

    const result2 = await projects.updateOne({_id: new ObjectId(projectId)}, { $set: {images: images, files: files}})

    return new Response(JSON.stringify({status: "ok", projectId: projectId, projectCategory: categoryId, images: images, files: files }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
