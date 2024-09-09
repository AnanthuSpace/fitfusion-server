import multer, { StorageEngine } from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import dotenv from 'dotenv';
dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});


const storage: StorageEngine = multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(req, file, callback) {
        const fileName = `${Date.now()}_${file.originalname}`;
        const filePath = `uploads/videos/${fileName}`;
        callback(null, filePath);
    }
});

const upload = multer({ storage });

export default upload;
