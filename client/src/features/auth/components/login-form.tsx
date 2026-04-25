import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod"
import useLogin from "../query/useLogin";
import { useState } from "react";
import { useAuth } from "../../../context/authContext";
import axios from "axios";

const LoginSchema = z.object({
    email: z.
        email("Please enter a valid email address").
        min(1, "Email is required").
        trim(),
    password: z.
        string({ error: "Password is required" }).
        min(8, "Password must be atleast 8 characters long")
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const LoginForm = () => {

    const { mutate, isPending } = useLogin();
    const [errorMessage, setErrorMessage] = useState("");
    const { setAuth } = useAuth();
    const { register, formState: { errors }, handleSubmit, reset } = useForm({
        // resolver is the translation layer between react-hook-form and the zod validation system - 
        // whenever form is submitted / changed react-hook-form passes the values over to the loginSchema for validation
        // and errors are returned in a format react-hook-form understands
        resolver: zodResolver(LoginSchema)
    });

    const onSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
        mutate(data, {
            onSuccess: (response) => {
                if (response.success && response.data && response.access_token) {
                    setAuth({

                        _id: response.data?._id,
                        access_token: response.access_token,
                        img: response.data?.img,
                        username: response.data?.username
                    })
                    reset();
                }
            },
            onError: (error: unknown) => {
                if (axios.isAxiosError(error)) {
                    console.log(error.response?.data)
                    setErrorMessage(error.response?.data?.message || "Something went wrong")
                }
            },
        })
    };

    return (
        <form
            className="flex flex-col gap-3.5"
            onSubmit={handleSubmit(onSubmit)}
        >
            {errorMessage && (
                <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/8 border border-destructive/20 px-4 py-2.5 rounded-xl animate-slide-down">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                    {errorMessage}
                </div>
            )}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground/90">Email</label>
                <input
                    className="w-full h-9 px-3 rounded-md bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                    type="email"
                    {...register("email")}
                    placeholder="you@company.com"
                    autoComplete="email"
                />
                {errors.email && <h1 className="text-xs text-red-600 tracking-tight">{errors.email.message}</h1>}
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground/90">Password</label>
                <input
                    className="w-full h-9 px-3 rounded-md bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register("password")}

                />
                {errors.password && <h1 className="text-xs text-red-600 tracking-tight">{errors.password.message}</h1>}
            </div>

            <button
                type="submit"
                className="w-full h-9 mt-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity hover:cursor-pointer"
            >
                {isPending ? "Signing in..." : "Sign in"}
            </button>
        </form>
    )
}