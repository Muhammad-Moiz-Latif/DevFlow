import nodemailer from 'nodemailer';
import crypto from 'crypto';
import "dotenv/config";
import { authServices } from '../modules/auth/services';
import { db } from '../config/db';
import { verificationTokenTable } from '../db/schema/tokens';
import { and, eq } from 'drizzle-orm';


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
    }
});

export type emailTokenType = "EMAIL_VERIFICATION" | "PASSWORD_RESET";

export const sendEmailToken = async (username: string, email: string, type: emailTokenType, userId: string) => {
    const tokenSecret = type === "EMAIL_VERIFICATION" ? crypto.randomInt(100000, 999999).toString() : crypto.randomBytes(16).toString("hex");

    // Invalidate any existing tokens for this user and type
    await db.delete(verificationTokenTable).where(and(
        eq(verificationTokenTable.user_id, userId),
        eq(verificationTokenTable.type, type)
    ));

    const createdToken = await authServices.createVerificationToken(userId, tokenSecret, type);

    if (type === "EMAIL_VERIFICATION") {
        try {
            const { rejected } = await transporter.sendMail({
                from: `DevFlow <${process.env.SENDER_EMAIL}>`,
                to: email,
                subject: 'Verify Your Email - DevFlow',
                html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                <h2>Hi ${username},</h2>
                <p>Welcome to <strong>DevFlow</strong>! Please verify your email address to get started.</p>
                <p>Use the OTP below to complete your verification:</p>

                <div style="
                    display: inline-block;
                    padding: 16px 32px;
                    background-color: #007bff;
                    color: white;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    border-radius: 8px;
                    margin: 20px 0;
                    text-align: center;
                ">
                    ${createdToken?.token}
                </div>

                <p><strong>This OTP will expire in 10 minutes.</strong></p>
                <p>If you didn't create a DevFlow account, you can safely ignore this email.</p>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    For security reasons, never share this OTP with anyone. DevFlow will never ask for your OTP.
                </p>
            </div>
        `
            });

            if (rejected.length > 0) {
                console.error("Rejected recipients:", rejected);
                throw new Error("Failed to send email");
            }

            return { success: true };
        } catch (error) {
            console.error("Email sending error:", error);
            throw error;
        }
    } else {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${createdToken?.token}`;
        try {
            const { rejected } = await transporter.sendMail({
                from: `DevFlow <${process.env.SENDER_EMAIL}>`,
                to: email,
                subject: 'Reset Your Password - DevFlow',
                html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                <h2>Hi ${username},</h2>
                <p>We received a request to reset your <strong>DevFlow</strong> account password.</p>
                <p>Click the button below to reset your password:</p>

                <a href="${resetLink}" style="
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                    margin: 20px 0;
                ">Reset Password</a>

                <p>Or copy and paste this link into your browser:</p>
                <p style="
                    background-color: #f4f4f4;
                    padding: 10px;
                    border-radius: 4px;
                    word-break: break-all;
                    font-size: 13px;
                    color: #333;
                ">${resetLink}</p>

                <p><strong>This link will expire in 1 hour.</strong></p>
                <p>If you didn't request a password reset, you can safely ignore this email. Your password will not change.</p>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    For security reasons, this link can only be used once. DevFlow will never ask for your password.
                </p>
            </div>
        `
            });

            if (rejected.length > 0) {
                console.error("Rejected recipients:", rejected);
                throw new Error("Failed to send email");
            }

            return { success: true };
        } catch (error) {
            console.error("Email sending error:", error);
            throw error;
        }
    }
};