import type { Request, Response } from 'express';
import { authServices } from './services';
import uploadImage from '../../utils/upload-image';

export const authController = {
    async registerUser(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            const image = req.file;

            var imgURL: string | null = null;

            if (image) {
                imgURL = await uploadImage(image.buffer);
            }

            if (!name || !email || !password) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            };

            const createUser = await authServices.registerUser(name, email, password, imgURL);

            if (createUser) {
                return res.status(201).json({
                    success: true,
                    message: `User created successfully, Id: ${createUser.id}`
                });
            };

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },

    async loginUser(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(401).json({
                    status: false,
                    message: "Invalid credentials"
                });
            };

            const isUser = await authServices.getUserViaCredentials(email, password);

            if (isUser) {
                return res.status(200).json({
                    success: true,
                    message: "Verified user"
                });
            }





        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },
};