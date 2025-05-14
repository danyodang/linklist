import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import uniqid from 'uniqid'

export async function uploadFile(file) {
  const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY,
      secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY,
    },
  })

  const ext = file.name.split('.').pop()
  const newFilename = uniqid() + '.' + ext

  await s3Client.send(new PutObjectCommand({
    Bucket: import.meta.env.VITE_BUCKET_NAME,
    Key: newFilename,
    ACL: 'public-read',
    Body: file,
    ContentType: file.type,
  }))

  return `https://${import.meta.env.VITE_BUCKET_NAME}.s3.amazonaws.com/${newFilename}`
}