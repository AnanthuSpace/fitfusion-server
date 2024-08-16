import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";

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
