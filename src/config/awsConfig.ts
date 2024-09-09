import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsCommand, ListObjectsCommandOutput, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
dotenv.config();

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY as string,
    }
});

export const getObjectURL = async (key: string): Promise<string> => {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    return url;
}

export const putObject = async (filename: string, contentType: string): Promise<string> => {
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `/uploads/trainer-uploads/${filename}`,
            ContentType: contentType 
        });
        const url = await getSignedUrl(s3Client, command);
        return url;
    } catch (error) {
        console.error("Error generating signed URL:", error);
        throw error; 
    }
};

export const listObjects = async (): Promise<ListObjectsCommandOutput | void> => {
    try {
        const command = new ListObjectsCommand({
            Bucket: process.env.S3_BUCKET_NAME as string,  
            Prefix: "/",  
        });

        const result = await s3Client.send(command); ;
        return result;  
    } catch (error) {
        console.error("Error listing objects:", error);
        throw error;  
    }
};


export const deleteObject = async (key: string): Promise<void> => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
        });

        await s3Client.send(command);
        console.log(`Object with key ${key} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting object:", error);
        throw error;
    }
};