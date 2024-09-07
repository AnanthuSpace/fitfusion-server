import multer, { StorageEngine } from "multer";
import AWS from "aws-sdk"
import multerS3 from "multer-s3"
import path from "path";
import fs from "fs";

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

const storage: StorageEngine = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.join(__dirname, "../../public"));
    },
    filename(req, file, callback) {
        const filePath = path.join(__dirname, "../../public", file.originalname);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        callback(null, file.originalname);
    }
});

const upload = multer({ storage });
export default upload;
