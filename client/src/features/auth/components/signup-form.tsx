import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod"
import { useSignUp } from "../query/useSignUp";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";

const SignUpSchema = z.object({
    username: z.string().min(8, "Minimum 8 characters are required").max(25, "username is too long"),
    email: z.email("Please enter a valid email").trim(),
    image: z.instanceof(FileList)
        .refine(files => files.length > 0, "Please select a profile image")
        .refine(files => files.length > 0 && files[0].size < 10_000_000, "Image must be less than 10MB")
        .refine(files => files.length > 0 && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(files[0].type), "Only JPEG, PNG, GIF, and WEBP formats are supported"),
    password: z.string().min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
        .min(1, "Please confirm your password")
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;


export const SignUpForm = () => {
    const [previewUrl, setPreviewUrl] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const invitationToken = sessionStorage.getItem('invitationToken');
    const { email } = location.state || {};
    const { register, reset, formState: { errors }, handleSubmit, watch } = useForm({
        resolver: zodResolver(SignUpSchema)
    });
    const [errorMessage, setErrorMessage] = useState("");
    const { mutate, isPending } = useSignUp();

    // watch for live updates in the image value internally in react-hook-form
    const profilePicture = watch("image");

    useEffect(() => {
        if (!profilePicture || profilePicture.length === 0) {
            setPreviewUrl("");
            return;
        }

        const file = profilePicture[0];
        const objectURL = URL.createObjectURL(file);
        setPreviewUrl(objectURL);

        return () => URL.revokeObjectURL(objectURL);
    }, [profilePicture]);

    const onSubmit: SubmitHandler<SignUpSchemaType> = async (data) => {
        mutate(data, {
            onSuccess: (response) => {
                if (response.success) {
                    sessionStorage.setItem("pendingVerificationUserId", response.data?.userId!);
                    navigate('/verify-email', { state: { userId: response.data?.userId, fromInvite: invitationToken ? true : false } });
                    reset();
                }
            },
            onError: (error: Error) => {
                if (axios.isAxiosError(error)) {
                    console.error(error);
                    setErrorMessage(error.response?.data.message || "Something went wrong")
                }
            }
        });
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

            {/* FULL NAME FIELD */}
            <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-foreground/80 tracking-wide">
                    Full name
                </label>
                <input
                    className="w-full h-10 px-3.5 rounded-md bg-surface border border-border/60 text-[13.5px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all hover:border-border"
                    type="text"
                    {...register("username")}
                    placeholder="John Doe"
                    autoComplete="name"
                />
                {errors.username && (
                    <p className="text-[10px] font-mono text-destructive/80 tracking-wide">
                        {errors.username.message}
                    </p>
                )}
            </div>

            {/* EMAIL FIELD */}
            <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-foreground/80 tracking-wide">
                    Work email
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

            {/* PROFILE PICTURE FIELD */}
            <div className="flex items-center gap-4 py-1">
                <label className="relative cursor-pointer group">
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-border/60 overflow-hidden flex items-center justify-center group-hover:border-primary/40 transition-all bg-surface/50 group-hover:bg-surface">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <Camera className="w-5 h-5 text-muted-foreground/60 group-hover:text-muted-foreground/80 transition-colors" />
                        )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shadow-sm border border-primary/30">
                        +
                    </div>
                    <input type="file" accept="image/*" {...register("image")} className="hidden" />
                </label>
                <div>
                    <p className="text-[13px] font-medium text-foreground/80 tracking-tight">Add a photo</p>
                    <p className="text-[11px] text-muted-foreground/60 tracking-wide">This helps others recognize you</p>
                    {errors.image && (
                        <p className="text-[10px] font-mono text-destructive/80 tracking-wide mt-0.5">
                            {errors.image.message}
                        </p>
                    )}
                </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-foreground/80 tracking-wide">
                    Password
                </label>
                <div className="relative">
                    <input
                        className="w-full h-10 px-3.5 pr-10 rounded-md bg-surface border border-border/60 text-[13.5px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all hover:border-border"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...register("password")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
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

            {/* CONFIRM PASSWORD FIELD */}
            <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-foreground/80 tracking-wide">
                    Confirm password
                </label>
                <div className="relative">
                    <input
                        className="w-full h-10 px-3.5 pr-10 rounded-md bg-surface border border-border/60 text-[13.5px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all hover:border-border"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...register("confirmPassword")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword((visible) => !visible)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        className="absolute inset-y-0 right-0 flex items-center justify-center px-3.5 text-muted-foreground/60 hover:text-foreground transition-colors"
                    >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="text-[10px] font-mono text-destructive/80 tracking-wide">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            {/* SIGNUP BUTTON */}
            <button
                type="submit"
                disabled={isPending}
                className="group relative w-full h-10 mt-1 rounded-md bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {isPending ? "Creating account..." : "Create account"}
                    {!isPending && (
                        <ArrowRight className="size-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                    )}
                </span>
                {/* Subtle hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
        </form>
    );
}