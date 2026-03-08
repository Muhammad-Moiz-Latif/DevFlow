import multer from 'multer'

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,  //5MB
    },
    fileFilter(req, file, callback) {
        if (file.mimetype.startsWith("image/")) {
            callback(null, true);
        } else {
            callback(new Error("only image file types are allowed"))
        }
    },
});