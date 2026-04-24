import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod"
import { Field } from "../../../components/ui/AuthShell";

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

    const { register, formState: { errors }, handleSubmit, reset } = useForm({
        // resolver is the translation layer between react-hook-form and the zod validation system - 
        // whenever form is submitted / changed react-hook-form passes the values over to the loginSchema for validation
        // and errors are returned in a format react-hook-form understands
        resolver: zodResolver(LoginSchema)
    });

    const onSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
        console.log('heya')
        console.log(data);
    };

    return (
        <form
            className="flex flex-col gap-3.5"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div>
                <input
                    className="w-full h-9 px-3 rounded-md bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                    type="email"
                    {...register("email")}
                    placeholder="you@company.com"
                    autoComplete="email"
                />
                {errors.email && <h1 className="text-xs text-red-600 tracking-tight">{errors.email.message}</h1>}
            </div>
            <div>
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
                Sign in
            </button>
        </form>
    )
}