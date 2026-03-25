import type { Request, Response } from 'express';
import { authServices } from './services';
import uploadImage from '../../utils/upload-image';
import jwt from 'jsonwebtoken';
import { sendEmailToken } from '../../utils/send-email';

export const authController = {

    async registerUser(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(409).json({
                    success: false,
                    message: "Invalid credentials"
                });
            };

            const image = req.file;

            let imgURL: string | null = null;

            if (image) {
                imgURL = await uploadImage(image.buffer);
            };

            const doesUserExist = await authServices.doesUserAlreadyExist(email, name);

            if (doesUserExist) {
                return res.status(409).json({
                    success: false,
                    message: "An account with this email or username already exists"
                });
            };

            const createUser = await authServices.registerUser(name, email, password, imgURL);

            if (!createUser) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to create account"
                });
            }

            await sendEmailToken(createUser.name, createUser.email!, "EMAIL_VERIFICATION", createUser.id);

            // sending userId to frontend in-case of re-creating verification token 
            return res.status(201).json({
                success: true,
                message: "Account created successfully. Please check your email to verify your account.",
                data: { userId: createUser.id }
            });


        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },

    async resendVerificationToken(req: Request, res: Response) {
        try {
            const { userId, type } = req.body;

            if (!userId) {
                return res.status(409).json({
                    success: false,
                    message: "User-Id is required"
                })
            };

            const doesUserExist = await authServices.getUserViaId(userId);

            if (!doesUserExist) {
                return res.status(400).json({
                    success: false,
                    message: "User not found"
                })
            };

            if (doesUserExist.status === 'SUCCESS') {
                return res.status(400).json({
                    success: false,
                    message: "User is already verified"
                })
            };

            await sendEmailToken(doesUserExist.name, doesUserExist.email!, type, doesUserExist.id);

            return res.status(200).json({
                success: true,
                message: "Verification code resent. Please check your email."
            });


        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                json: "Internal server error"
            });
        }
    },

    async verifyEmailOTP(req: Request, res: Response) {
        try {
            const { userId, otp } = req.body;

            if (!userId || !otp) {
                return res.status(409).json({
                    success: false,
                    message: "OTP is required"
                });
            };

            const getUser = await authServices.getUserViaId(userId);

            if (!getUser) {
                return res.status(404).json({
                    success: false,
                    message: "User does not exist"
                });
            };

            const getToken = await authServices.getVerificationToken(userId, "EMAIL_VERIFICATION");

            if (!getToken) {
                return res.status(404).json({
                    success: false,
                    message: "No verification token found. Please request a new one."
                });
            };

            if (new Date() > new Date(getToken.expiresAt!)) {
                await authServices.deleteVerificationToken(getToken.id, "EMAIL_VERIFICATION");
                return res.status(400).json({
                    success: false,
                    message: "OTP has expired. Please request a new one."
                });
            };

            if (getToken.token != otp) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP."
                });
            };

            await authServices.markUserVerified(userId);
            await authServices.deleteVerificationToken(getToken.id, "EMAIL_VERIFICATION");

            return res.status(200).json({
                success: true,
                message: "Email verified successfully."
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
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

            const { isUser, user } = await authServices.getUserViaCredentials(email, password);

            if (!isUser) {
                return res.status(404).json({
                    success: false,
                    message: "User does not exist"
                });
            };

            const access_secret = process.env.ACCESS_TOKEN_SECRET!;
            const refresh_secret = process.env.REFRESH_TOKEN_SECRET!;

            const payload = {
                id: user?.id,
            };

            const access_token = jwt.sign(payload, access_secret, { expiresIn: "15m" });
            const refresh_token = jwt.sign(payload, refresh_secret, { expiresIn: "1d" });




        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },
};