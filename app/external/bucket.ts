import axios from "axios";

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL as string;
const BUCKET_KEY = process.env.BUCKET_KEY as string;
const BUCKET = process.env.BUCKET as string;

export async function uploadToBucket(filesToUpload: File[]) {
  if (!filesToUpload.length) throw new Error("No files provided");

  const formData = new FormData();
  filesToUpload.forEach((file) => {
    formData.append("files", file);
  });

  const res = await axios.post(`${BUCKET_URL}/storage/${BUCKET}/upload`, formData, {
      headers: {
        "x-api-key": BUCKET_KEY,
      },
    }
  );

  console.log(res.data)

  const success = res.status == 200 || res.status == 201
  return {
    success,
    data: res.data,
    status: res.status
  };
}

export async function updateInBucket(filename: string, fileToUpload: File) {
  const formData = new FormData();
  formData.append("files", fileToUpload)

  const res = await axios.put(`${BUCKET_URL}/storage/${BUCKET}/${filename}`, formData, {
    headers: {
      "x-api-key": BUCKET_KEY,
    }
  });
  
  const success = res.status == 200 || res.status == 201
  return {
    success,
    data: res.data,
    status: res.status
  };
}

export async function deleteFromBucket(filesToDelete: string[]) {
  const res = await fetch(`${BUCKET_URL}/storage/${BUCKET}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': BUCKET_KEY
    },
    body: JSON.stringify({filenames: filesToDelete})
  });

  const data = await res.json();
  const success = res.status == 200 || res.status == 201
  return {
    success,
    data: data,
    status: res.status
  };
}