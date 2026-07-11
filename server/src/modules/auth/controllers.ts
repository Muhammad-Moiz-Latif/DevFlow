import type { Request, Response } from 'express';
import { authServices } from './services';
import uploadImage from '../../utils/upload-image';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { sendEmailToken } from '../../utils/send-email';
import { oAuth2Client } from '../../config/oauth';

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

            const createUser = await authServices.registerUser(name, email, imgURL, password);

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

            if (type === "EMAIL_VERIFICATION" && doesUserExist.status === 'SUCCESS') {
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

    async handleGoogleVerification(req: Request, res: Response) {
        try {
            const { code } = req.body;

            // Exchange code for tokens (tokens.access_token, tokens.id_token, tokens.refresh_token)
            const { tokens } = await oAuth2Client.getToken(code);

            const ticket = await oAuth2Client.verifyIdToken({
                idToken: tokens.id_token!,
                audience: process.env.GOOGLE_CLIENT_ID!
            });

            const payload = ticket.getPayload();

            // edge-case: if user already exists via credentials return to client and ask for merging both accounts
            const doesUserAlreadyExist = await authServices.getUserViaEmail(payload?.email!);

            if (doesUserAlreadyExist?.authType === 'CREDENTIALS') {
                return res.status(201).json({
                    success: true,
                    message: 'This Google account is connected to your existing email. Would you like to link them for easier login?'
                });
            };

            const access_secret = process.env.ACCESS_TOKEN_SECRET!;
            const refresh_secret = process.env.REFRESH_TOKEN_SECRET!;
            const doesUserBelongToAWorkspace = await authServices.doesUserBelongToAWorkspace(doesUserAlreadyExist?.id!);

            // edge case: if user already exists via google/both we simply return that users data to client
            if (doesUserAlreadyExist?.authType === 'GOOGLE' || doesUserAlreadyExist?.authType === 'BOTH') {

                const access_token = jwt.sign(
                    {
                        id: doesUserAlreadyExist?.id,
                        createUsername: doesUserAlreadyExist.name,
                        img: doesUserAlreadyExist.img
                    },
                    access_secret,
                    { expiresIn: "15m" }
                );

                const refresh_token = jwt.sign(
                    {
                        id: doesUserAlreadyExist?.id,
                        createUsername: doesUserAlreadyExist.name,
                        img: doesUserAlreadyExist.img
                    },
                    refresh_secret,
                    { expiresIn: "1d" }
                );

                res.cookie("refresh_token", refresh_token, {
                    httpOnly: true,
                    sameSite: "lax",
                    maxAge: 24 * 60 * 60 * 1000
                });

                return res.status(200).json({
                    success: true,
                    message: "createUser has been verified successfully!",
                    data: {
                        _id: doesUserAlreadyExist.id,
                        username: doesUserAlreadyExist.name,
                        img: doesUserAlreadyExist.img,
                        email: doesUserAlreadyExist.email,
                        createdAt: doesUserAlreadyExist.createdAt
                    },
                    access_token,
                    defaultWorkspaceSlug: doesUserBelongToAWorkspace?.slug ?? null
                });
            };

            // creating brand new user
            const createUser = await authServices.registerUser(payload?.name!, payload?.email!, payload?.picture!, undefined, true);

            if (!createUser) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to create account"
                });
            };

            const access_token = jwt.sign(
                {
                    id: createUser?.id,
                    createUsername: createUser.name,
                    img: createUser.img
                },
                access_secret,
                { expiresIn: "15m" }
            );

            const refresh_token = jwt.sign(
                {
                    id: createUser?.id,
                    createUsername: createUser.name,
                    img: createUser.img
                },
                refresh_secret,
                { expiresIn: "1d" }
            );

            res.cookie("refresh_token", refresh_token, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                success: true,
                message: "createUser has been verified successfully!",
                data: {
                    _id: createUser.id,
                    username: createUser.name,
                    img: createUser.img,
                    email: createUser.email,
                    createdAt: createUser.createdAt
                },
                access_token,
                defaultWorkspaceSlug: doesUserBelongToAWorkspace?.slug ?? null

            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async updateAUser(){},

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
                return res.status(409).json({
                    success: false,
                    message: "Invalid credentials"
                });
            };

            const { isUser, user } = await authServices.getUserViaCredentials(email, password);


            if (!isUser || !user) {
                return res.status(404).json({
                    success: false,
                    message: "User does not exist"
                });
            };

            const doesUserBelongToAWorkspace = await authServices.doesUserBelongToAWorkspace(user.id);

            const access_secret = process.env.ACCESS_TOKEN_SECRET!;
            const refresh_secret = process.env.REFRESH_TOKEN_SECRET!;

            const payload = {
                id: user?.id,
                username: user.name,
                img: user.img
            };

            const access_token = jwt.sign(payload, access_secret, { expiresIn: "15m" });
            const refresh_token = jwt.sign(payload, refresh_secret, { expiresIn: "1d" });

            res.cookie("refresh_token", refresh_token, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                success: true,
                message: "User has been verified successfully!",
                data: {
                    _id: user.id,
                    username: user.name,
                    img: user.img,
                    email: user.email,
                    createdAt: user.createdAt
                },
                access_token,
                defaultWorkspaceSlug: doesUserBelongToAWorkspace?.slug ?? null
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(409).json({
                    success: false,
                    message: "Email is required"
                });
            };

            const theUser = await authServices.getUserViaEmail(email);

            if (!theUser) {
                return res.status(400).json({
                    success: false,
                    message: "User does not exist"
                });
            };

            const passwordToken = await sendEmailToken(theUser.name, email, "PASSWORD_RESET", theUser.id);

            if (!passwordToken) {
                res.status(400).json({
                    success: false,
                    message: "An error occured while sending email"
                });
            };

            return res.status(200).json({
                success: true,
                message: "A reset link has been sent to your email. Please reset your password timely"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async resetPassword(req: Request, res: Response) {
        try {
            const { password, tokenSecret } = req.body;

            if (!password || !tokenSecret) {
                return res.status(409).json({
                    success: false,
                    message: "Password is required"
                });
            };

            const getVerificationToken = await authServices.getVerificationTokenViaTokenSecret(tokenSecret);

            if (!getVerificationToken) {
                return res.status(404).json({
                    success: false,
                    message: "token does not exist"
                });
            };

            if (new Date() > new Date(getVerificationToken.expiresAt!)) {
                return res.status(400).json({
                    success: false,
                    message: "token has expired, please generate a new link"
                });
            };

            await authServices.updatePassword(password);

            return res.status(200).json({
                success: true,
                message: "Your password has been updated successfully!"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async refreshAccessToken(req: Request, res: Response) {
        try {
            const { refresh_token } = req.cookies;
            if (!refresh_token) {
                return res.status(401).json({
                    success: false,
                    message: "Refresh token missing",
                });
            };

            jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET!, (err: any, decoded: any) => {
                if (err || !decoded || typeof decoded === "string") {
                    return res.status(403).json({
                        success: false,
                        message: "Invalid refresh token",
                    });
                }

                const access_token = jwt.sign(
                    { id: decoded.id, username: decoded.username, img: decoded.img },
                    process.env.ACCESS_TOKEN_SECRET!,
                    { expiresIn: "15m" }
                );
                return res.status(200).json({
                    success: true,
                    message: "Access token refreshed",
                    data: {
                        userId: decoded.id,
                        username: decoded.username,
                        img: decoded.img
                    },
                    access_token,
                });
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async getMe(req: Request, res: Response) {
        try {
            const userId = req.user?.id;

            const user = await authServices.getUserViaId(userId!);

            return res.status(200).json({
                success: true,
                message: "Returned your info successfully",
                data: user
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        };
    },

    async handleLogout(req: Request, res: Response) {
        const { refresh_token } = req.cookies;

        if (!refresh_token) {
            return res.status(200).json({
                success: true,
                message: "Refresh token already deleted. Logged out successfully",
            });
        };

        res.clearCookie("refresh_token", { httpOnly: true, sameSite: "lax", maxAge: 24 * 60 * 60 * 1000 });

        return res.status(200).json({
            success: true,
            message: "Refresh token deleted. Logged out successfully"
        });
    },
};