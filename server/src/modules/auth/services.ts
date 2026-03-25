import { db } from "../../config/db";
import bcrypt from 'bcrypt';
import { UserTable } from "../../db/schema/users";
import { and, eq, or } from "drizzle-orm";
import type { emailTokenType } from "../../utils/send-email";
import { verificationTokenTable } from "../../db/schema/tokens";

export const authServices = {

    async registerUser(name: string, email: string, password: string, img: string | null) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [User] = await db.insert(UserTable).values({
            name,
            email,
            password: hashedPassword,
            img
        }).returning();

        return User;
    },

    async doesUserAlreadyExist(email: string, name: string) {
        const [getUser] = await db.select().from(UserTable).where(or(
            eq(UserTable.email, email),
            eq(UserTable.name, name)
        ));
        return getUser;
    },

    async getVerificationToken(userId: string, type: emailTokenType) {
        const [getToken] = await db.select().from(verificationTokenTable).where(and(
            eq(verificationTokenTable.user_id, userId),
            eq(verificationTokenTable.type, type)
        ));

        return getToken;
    },

    async markUserVerified(userId: string) {
        await db.update(UserTable).set({
            status: "SUCCESS"
        }).where(
            eq(UserTable.id, userId)
        );
    },

    async deleteVerificationToken(tokenId: string, type: emailTokenType) {
        await db.delete(verificationTokenTable).where(and(
            eq(verificationTokenTable.id, tokenId),
            eq(verificationTokenTable.type, type)
        ));
    },

    async getUserViaId(userId: string) {
        const [getUser] = await db.select().from(UserTable).where(
            eq(UserTable.id, userId)
        );
        return getUser;
    },

    async getUserViaCredentials(email: string, password: string) {
        const [getUser] = await db.select().from(UserTable).where(eq(
            UserTable.email, email
        )).limit(1);

        if (!getUser) {
            return {
                isUser: false,
                user: null
            }
        };

        const validPassword = await bcrypt.compare(password, getUser.password!);

        if (!validPassword) {
            return { isUser: false, user: null };
        }

        return { isUser: true, user: getUser };
    },

    async createVerificationToken(userId: string, token: string, type: emailTokenType) {
        const [createdToken] = await db.insert(verificationTokenTable).values({
            user_id: userId,
            token,
            type,
            expiresAt: new Date(Date.now() + 1000 * 60 * 5) // 5 mins
        }).returning();

        return createdToken;
    },
};