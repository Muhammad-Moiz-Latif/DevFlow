import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import { X, Mail } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

const InviteMemberSchema = z.object({
    email: z
        .email("Please enter a valid email address")
        .min(1, "Email is required")
        .trim(),
    role: z.enum(["ADMIN", "MEMBER", "VIEWER"], {
        error: "Please select a role",
    }),
});

export type InviteMemberSchemaType = z.infer<typeof InviteMemberSchema>;

export const InviteMemberModal = ({ setInviteModalVisibility }: { setInviteModalVisibility: Dispatch<SetStateAction<boolean>> }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<InviteMemberSchemaType>({
        resolver: zodResolver(InviteMemberSchema),
        defaultValues: { role: "MEMBER" },
    });

    const onSubmit = async (data: InviteMemberSchemaType) => {
        // future mutation 
    };

    return (
        <div
            className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setInviteModalVisibility((prev) => !prev)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md rounded-3xl border border-border/s80 bg-surface/95 p-6 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            >
                <button
                    type="button"
                    onClick={() => setInviteModalVisibility((prev) => !prev)}
                    aria-label="Close"
                    className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                >
                    <X className="size-4" />
                </button>

                <div className="mb-6 space-y-1.5 pr-8">
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">
                        Invite a member
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Send an invitation to a personal email address. They'll be added
                        to this workspace once accepted.
                    </p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-foreground/90">
                            Email address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="email"
                                placeholder="example@gmail.com"
                                autoComplete="email"
                                {...register("email")}
                                className="h-10 w-full rounded-md border border-border bg-background/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-destructive tracking-tight">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-foreground/90">
                            Role
                        </label>
                        <select
                            {...register("role")}
                            className="h-10 w-full cursor-pointer rounded-md border border-border bg-background/60 px-3 text-sm text-foreground transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="MEMBER">Member</option>
                            <option value="VIEWER">Viewer</option>
                        </select>
                        {errors.role && (
                            <p className="text-xs text-destructive tracking-tight">
                                {errors.role.message}
                            </p>
                        )}
                    </div>

                    <div className="mt-2 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setInviteModalVisibility((prev) => !prev)}
                            className="h-9 rounded-md px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            // disabled={isPending}
                            className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:cursor-pointer hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Send Invite
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};