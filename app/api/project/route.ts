import { MongoClient, ObjectId } from 'mongodb'
import { isObjectIdOrHexString } from 'mongoose';
import path from "path";
import fs from "fs";
import { ProjectResource } from '@/app/types/types';
import { getSession } from '@/auth';
import { uploadToBucket } from '@/app/external/bucket';

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

    

    const filesToUpload = []
    for (let i = 0; i < imageMap.length; i++) {
        const file = body[imageMap[i]] as File;
        filesToUpload.push(file)
    }

    for (let i = 0; i < fileMap.length; i++) {
        const file = body[fileMap[i]] as File;
        filesToUpload.push(file)
    }

    const { success, data } = await uploadToBucket(filesToUpload)
    if(!success) {
        return new Response(null, { status: 503 });
    }


    const files: ProjectResource[] = []
    const images: ProjectResource[] = []
    
    for (let i = 0; i < fileMap.length; i++) {
        const file = body[fileMap[i]] as File;
        const filename = file.name
        let url = ""

        for(let f of data.files) {
            if(f.original == filename) {
                url = f.uri
            }
        }

        files.push({url: url, name: filename})
    }
    
    for (let i = 0; i < imageMap.length; i++) {
        const file = body[imageMap[i]] as File;
        const filename = file.name
        let url = ""

        for(let f of data.files) {
            if(f.original == filename) {
                url = f.uri
            }
        }

        images.push({url: url, name: filename})
    }

    await projects.updateOne({_id: new ObjectId(projectId)}, { $set: {images: images, files: files}})

    return new Response(JSON.stringify({status: "ok", projectId: projectId, projectCategory: categoryId, images: images, files: files }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
