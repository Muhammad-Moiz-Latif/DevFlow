import z from "zod";

export const LoginSchema = z.object({
    email: z.
        email("Please enter a valid email address").
        min(1, "Email is required").
        trim(),
    password: z.
        string({ error: "Password is required" }).
        min(8, "Password must be atleast 8 characters long")
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;