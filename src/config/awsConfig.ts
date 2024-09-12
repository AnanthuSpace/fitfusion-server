import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsCommand, ListObjectsCommandOutput, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY as string,
    }
});

export const UpdateToAws = async (bucketName: string, profileKey: string, file: any): Promise<any> => {
    try {
        let fileBuffer = file.buffer;

        const uniqueName = crypto.randomBytes(16).toString('hex') + '-' + file.originalname;

        const params = {
            Bucket: bucketName,
            Key: `${profileKey}${uniqueName}`,
            Body: fileBuffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        const sent = await s3Client.send(command);

        if (sent && sent.$metadata.httpStatusCode === 200) {
            const fileUrl = uniqueName;
            return fileUrl;
        } else {
            throw new Error('File upload failed');
        }
    } catch (error: any) {
       console.error('Error uploading file to S3:', error.message);
            throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
};

export const getObjectURL = async (key: string): Promise<string> => {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    return url;
}