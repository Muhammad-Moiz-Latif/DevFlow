import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod"
import useLogin from "../query/useLogin";
import { useState } from "react";
import axios from "axios";
import { successToast } from "../../../components/ui/CustomToasts";
import { useLocation, useNavigate } from "react-router";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuthStore } from "../../../stores/auth-store";


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
    const navigate = useNavigate();
    const { mutate, isPending } = useLogin();
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { setAuth: setAuthStore } = useAuthStore();
    const location = useLocation();
    const invitationToken = sessionStorage.getItem('invitationToken');
    const { email, fromInvite } = location.state || {};
    const { register, formState: { errors }, handleSubmit, reset } = useForm({
        // resolver is the translation layer between react-hook-form and the zod validation system - 
        // whenever form is submitted / changed react-hook-form passes the values over to the loginSchema for validation
        // and errors are returned in a format react-hook-form understands
        resolver: zodResolver(LoginSchema)
    });

    const onSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
        setErrorMessage("");
        mutate(data, {
            onSuccess: (response) => {
                if (response.success && response.data && response.access_token) {
                    successToast(`Welcome back, ${response.data.username}`);
                    reset();
                    setAuthStore({
                        _id: response.data?._id,
                        image: response.data?.img,
                        username: response.data?.username
                    }, response.access_token);
                    if (fromInvite && invitationToken) {
                        return setTimeout(() => {
                            navigate(`/accept-invitation?token=${invitationToken}`);
                        }, 1000);
                    }
                    if (!response.defaultWorkspaceSlug) {
                        return setTimeout(() => {
                            navigate('/create-workspace');
                        }, 1000);
                    };
                    setTimeout(() => {
                        navigate(`/w/${response.defaultWorkspaceSlug}`);
                    }, 1000);

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
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
        >
            {errorMessage && (
                <div className="flex items-center gap-2.5 text-[11px] text-destructive bg-destructive/5 border border-destructive/20 px-4 py-2.5 rounded-md animate-slide-down">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                    <span className="font-mono tracking-wide">{errorMessage}</span>
                </div>
            )}

            <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-foreground/80 tracking-wide">
                    Email
                </label>
                <input
                    className="w-full h-10 px-3.5 rounded-md bg-surface border border-border/60 text-[13.5px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all hover:border-border"
                    type="email"
                    {...register("email")}
                    placeholder={email ?? "you@company.com"}
                    autoComplete="email"
                />
                {errors.email && (
                    <p className="text-[10px] font-mono text-destructive/80 tracking-wide">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-foreground/80 tracking-wide">
                        Password
                    </label>
                    <a
                        href="#"
                        className="text-[10px] font-mono text-muted-foreground/60 hover:text-foreground transition-colors tracking-wide"
                    >
                        Forgot password?
                    </a>
                </div>
                <div className="relative">
                    <input
                        className="w-full h-10 px-3.5 pr-10 rounded-md bg-surface border border-border/60 text-[13.5px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all hover:border-border"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...register("password")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute inset-y-0 right-0 flex items-center justify-center px-3.5 text-muted-foreground/60 hover:text-foreground transition-colors"
                    >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-[10px] font-mono text-destructive/80 tracking-wide">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="group relative w-full h-10 mt-1 rounded-md bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {isPending ? "Signing in..." : "Sign in"}
                    {!isPending && (
                        <ArrowRight className="size-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                    )}
                </span>
                {/* Subtle hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
        </form>
    );
};