import { db } from "../../config/db";
import bcrypt from 'bcrypt';
import { UserTable } from "../../db/schema/users";
import { eq } from "drizzle-orm";

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

    async getUserViaCredentials(email: string, password: string) {
        const [getUser] = await db.select().from(UserTable).where(eq(
            UserTable.email, email
        )).limit(1);

        var isUser = false;

        if (getUser) {
            isUser = await bcrypt.compare(password, getUser?.password!);
            return isUser;
        }
        return isUser;
    },
};