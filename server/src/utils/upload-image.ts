import cloudinary from '../config/cloudinary';

type UploadInput = Buffer | string;


export default async function uploadImage(input: UploadInput): Promise<string> {

    let buffer: Buffer;
    // If input is a URL, download it first
    if (typeof input === 'string') {
        try {
            const response = await fetch(input);
            const arrayBuffer = await response.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
        } catch (error) {
            throw new Error(`Failed to download image from URL: ${error}`);
        }
    } else {
        buffer = input;
    };

    //manually created promise uploading to cloudinary
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            //cloudinary metadata (will now store images in users folder in cloudinary)
            { folder: "users" },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("Upload failed"));
                resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};
