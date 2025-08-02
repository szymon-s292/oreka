import { MongoClient, ObjectId } from "mongodb";
import { isObjectIdOrHexString, isValidObjectId } from "mongoose";
import path from "path";
import fs from "fs";
import { ProjectResource } from "@/app/types/types";
import { getSession } from "@/auth";
import { deleteFromBucket, uploadToBucket } from "@/app/external/bucket";

const MONGO_URI = process.env.MONGO_URI as string;
const client = new MongoClient(MONGO_URI);
const dbName = process.env.DB_NAME as string;
const APP_DIR = process.env.ROOT_PATH as string;

//read project - no auth
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("projects");

  if (!isValidObjectId(id)) {
    return new Response(JSON.stringify({ status: "invalid parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await collection.findOne({ _id: new ObjectId(id) });

  if (!result) {
    return new Response(JSON.stringify({ status: "invalid parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

//update project
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return new Response(JSON.stringify({ status: "access denied" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const projectId = (await params).id;
  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  const name = (body.projectName as string) || null;
  const description = (body.projectDescription as string) || null;
  const categoryId = (body.projectCategory as string) || null;

  const fileMap = JSON.parse(body.fileMap as string) || [];
  const imageMap = JSON.parse(body.imageMap as string) || [];

  if (
    !name ||
    !description ||
    !categoryId ||
    !isObjectIdOrHexString(categoryId)
  ) {
    return new Response(JSON.stringify({ status: "invalid parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await client.connect();
  const db = client.db(dbName);
  const categories = db.collection("categories");
  const category = await categories.findOne({ _id: new ObjectId(categoryId) });

  if (!category) {
    return new Response(
      JSON.stringify({ status: "invalid project category" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const projects = db.collection("projects");
  const files: ProjectResource[] = [];
  const images: ProjectResource[] = [];

  const project = await projects.findOne({ _id: new ObjectId(projectId) });

  const toDelete: string[] = [];
  for (let pr of [...project?.images, ...project?.files] as ProjectResource[]) {
    if (pr.url) toDelete.push(pr.url.split("/").at(-1) || "");
  }

  const { success } = await deleteFromBucket(toDelete);
  if (!success) {
    return new Response(null, { status: 503 });
  }

  const filesToUpload = [];
  for (let i = 0; i < imageMap.length; i++) {
    const file = body[imageMap[i]] as File;
    filesToUpload.push(file);
  }

  for (let i = 0; i < fileMap.length; i++) {
    const file = body[fileMap[i]] as File;
    filesToUpload.push(file);
  }

  const { success: success2, data } = await uploadToBucket(filesToUpload);
  if (!success2) {
    return new Response(null, { status: 503 });
  }

  for (let i = 0; i < fileMap.length; i++) {
    const file = body[fileMap[i]] as File;
    const filename = file.name;
    let url = "";

    for (let f of data.files) {
      if (f.original == filename) {
        url = f.uri;
      }
    }

    files.push({ url: url, name: filename });
  }

  for (let i = 0; i < imageMap.length; i++) {
    const file = body[imageMap[i]] as File;
    const filename = file.name;
    let url = "";

    for (let f of data.files) {
      if (f.original == filename) {
        url = f.uri;
      }
    }

    images.push({ url: url, name: filename });
  }

  await projects.updateOne(
    { _id: new ObjectId(projectId) },
    {
      $set: {
        name: name,
        description: description,
        categoryId: new ObjectId(categoryId),
        images: images,
        files: files,
      },
    }
  );

  return new Response(
    JSON.stringify({
      status: "ok",
      projectId: projectId,
      projectCategory: categoryId,
      images: images,
      files: files,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

//delete project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return new Response(JSON.stringify({ status: "access denied" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const projectId = (await params).id;

  if (!isObjectIdOrHexString(projectId)) {
    return new Response(JSON.stringify({ status: "invalid id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await client.connect();
  const db = client.db(dbName);
  const projects = db.collection("projects");
  const find = await projects.findOne({ _id: new ObjectId(projectId) });
  
  const project = await projects.deleteOne({ _id: new ObjectId(projectId) });


  const toDelete: string[] = [];
  for (let pr of [...find?.images, ...find?.files] as ProjectResource[]) {
    if (pr.url) toDelete.push(pr.url.split("/").at(-1) || "");
  }

  const { success } = await deleteFromBucket(toDelete);
  if (!success) {
    return new Response(null, { status: 503 });
  }



  if (project.deletedCount == 0) {
    return new Response(JSON.stringify({ status: "invalid parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ status: "ok", projectId: projectId }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
