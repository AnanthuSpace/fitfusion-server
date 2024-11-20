import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import { Response } from 'express';
import { PassThrough } from 'stream';
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

        console.log("uniqueName : ", uniqueName)
        
        const params = {
            Bucket: bucketName,
            Key: `${profileKey}${uniqueName}`,
            Body: fileBuffer,
            ContentType: file.mimetype,
        };

        console.log("params :", params)
        const command = new PutObjectCommand(params);
        const sent = await s3Client.send(command);
        console.log(sent)
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
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 * 24 * 7 });
    return url;
}

export const getVideos = async (key: string): Promise<string> => {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME_VIDEOS,
        Key: key,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 * 24 * 7 });
    return url;
}

export const streamVideoFromS3 = async (key: string, res: Response) => {
    try {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME_VIDEOS,
            Key: key,
        };

        const command = new GetObjectCommand(params);
        const data = await s3Client.send(command);

        if (data.Body) {
            res.setHeader('Content-Type', 'video/mp4'); 
            res.setHeader('Content-Length', data.ContentLength || 0);
            res.setHeader('Accept-Ranges', 'bytes');
            
            const bodyStream = data.Body as any;
            bodyStream.on('error', (streamError: any) => {
                console.error('Stream Error:', streamError.message);
                res.status(500).json({ success: false, message: 'Error while streaming video.' });
            });

            bodyStream.pipe(res);
        } else {
            res.status(404).json({ success: false, message: 'Video not found.' });
        }
    } catch (error: any) {
        console.error('Error streaming video from S3:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error while streaming video.' });
    }
};