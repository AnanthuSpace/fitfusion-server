// s3Config.ts

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 Client
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY as string,
  }
});

// Function to get signed URL
export const getObjectURL = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: "fitfusion-store",
    Key: key
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 20 });
  return url;
}
