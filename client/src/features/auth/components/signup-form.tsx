import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod"

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
    const { register, reset, formState: { errors }, handleSubmit, watch } = useForm({
        resolver: zodResolver(SignUpSchema)
    });

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

    };

    return (
        <form
            className="flex flex-col gap-3.5"
            onSubmit={handleSubmit(onSubmit)}
        >
            {/* {errorMessage && (
                <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/8 border border-destructive/20 px-4 py-2.5 rounded-xl animate-slide-down">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                    {errorMessage}
                </div>
            )} */}

            {/* FULL NAME FIELD */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground/90">Full name</label>
                <input
                    className="w-full h-9 px-3 rounded-md bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                    type="text"
                    {...register("username")}
                    placeholder="John doe"
                />
                {errors.username && <h1 className="text-xs text-red-600 tracking-tight">{errors.username.message}</h1>}
            </div>

            {/* EMAIL FIELD */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground/90">Work email</label>
                <input
                    className="w-full h-9 px-3 rounded-md bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                    type="email"
                    {...register("email")}
                    placeholder="you@gmail.com"
                />
                {errors.email && <h1 className="text-xs text-red-600 tracking-tight">{errors.email.message}</h1>}
            </div>

            {/* PROFILE PICTURE FIELD */}
            <div className="flex items-center gap-4 animate-slide-down" style={{ animationDelay: '0.1s' }}>
                <label className="relative cursor-pointer group">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-border overflow-hidden flex items-center justify-center group-hover:border-primary transition-colors bg-secondary/50">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <Camera className="w-5 h-5 text-muted-foreground/60" />
                        )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-md">
                        +
                    </div>
                    <input type="file" accept="image/*" {...register("image")} className="hidden" />
                </label>
                <div>
                    <p className="text-sm font-medium text-foreground font-sans">Add a photo</p>
                    <p className="text-[11px] text-muted-foreground font-sans">This helps others recognize you</p>
                    {errors.image && <p className="text-xs text-destructive mt-0.5">{errors.image.message}</p>}
                </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground/90">Password</label>
                <input
                    className="w-full h-9 px-3 rounded-md bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}

                />
                {errors.password && <h1 className="text-xs text-red-600 tracking-tight">{errors.password.message}</h1>}
            </div>

            {/* CONFIRM PASSWORD FIELD */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground/90">Confirm password</label>
                <input
                    className="w-full h-9 px-3 rounded-md bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                    type="password"
                    placeholder="••••••••"
                    {...register("confirmPassword")}

                />
                {errors.confirmPassword && <h1 className="text-xs text-red-600 tracking-tight">{errors.confirmPassword.message}</h1>}
            </div>

            {/* SIGNUP BUTTON */}
            <button
                type="submit"
                className="w-full h-9 mt-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity hover:cursor-pointer"
            >
                Sign up
            </button>
        </form>
    )
}