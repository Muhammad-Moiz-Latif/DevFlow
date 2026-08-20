import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { X, Mail, Shield, User, Eye, Check } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useInviteMember } from "../query/useInviteMember";
import { errorToast, successToast } from "../../../components/ui/CustomToasts";

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

const ROLE_OPTIONS = [
    {
        value: "ADMIN" as const,
        label: "Admin",
        description: "Full access to settings, members, and billing",
        icon: Shield,
    },
    {
        value: "MEMBER" as const,
        label: "Member",
        description: "Can create and edit projects and issues",
        icon: User,
    },
    {
        value: "VIEWER" as const,
        label: "Viewer",
        description: "Read-only access to workspace content",
        icon: Eye,
    },
];

export const InviteMemberModal = ({
    setInviteModalVisibility,
    workspaceId,
}: {
    setInviteModalVisibility: Dispatch<SetStateAction<boolean>>;
    workspaceId: string;
}) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<InviteMemberSchemaType>({
        resolver: zodResolver(InviteMemberSchema),
        defaultValues: { role: "MEMBER" },
    });
    const { mutate, isPending } = useInviteMember();
    const selectedRole = watch("role");

    const onSubmit = async (data: InviteMemberSchemaType) => {
        mutate(
            {
                workspaceId,
                data,
            },
            {
                onSuccess: (data) => {
                    if (data.status === 200) {
                        successToast("The user is aready a member of this workspace");
                    } else if (data.status === 209) {
                        successToast("An active email has already been sent to this user");
                    } else if (data.status === 201) {
                        successToast("Email sent successfully!");
                    }

                    reset();
                    setTimeout(() => {
                        setInviteModalVisibility((prev) => !prev);
                    }, 1000);
                },
                onError: () => {
                    reset();
                    errorToast("Could not send email"),
                        setTimeout(() => {
                            setInviteModalVisibility((prev) => !prev);
                        }, 1000);
                },
            }
        );
    };

    return (
        <div
            className="fixed inset-0 z-70 flex items-center justify-center bg-background/60 backdrop-blur-sm p-4"
            onClick={() => setInviteModalVisibility((prev) => !prev)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md border border-border bg-card overflow-hidden shadow-2xl shadow-black/20"
            >
                {/* Header bar */}
                <div className="h-10 border-b border-border bg-sidebar/50 flex items-center px-4 gap-2.5">
                    <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase">
                        Invite
                    </span>
                    <span className="text-[10px] font-mono text-foreground/70">New member</span>
                    <span className="ml-auto flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground/40">
                        <span className="size-1 rounded-full bg-primary/60 animate-pulse" />
                        {workspaceId.slice(0, 8)}
                    </span>
                    <button
                        type="button"
                        onClick={() => setInviteModalVisibility((prev) => !prev)}
                        aria-label="Close"
                        className="size-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface/50 transition-colors"
                    >
                        <X className="size-3.5" strokeWidth={1.8} />
                    </button>
                </div>

                <div className="p-5">
                    {/* Title */}
                    <div className="relative mb-5 pb-4 border-b border-border">
                        <div className="absolute top-0 left-0 size-1.5 border-t border-l border-primary/40" />
                        <div className="absolute top-0 right-0 size-1.5 border-t border-r border-primary/40" />

                        <div className="inline-flex items-center gap-2 mb-2 text-[9px] font-mono tracking-[0.14em] text-muted-foreground/50 uppercase">
                            <span className="w-3 h-px bg-border" />
                            Workspace invite
                            <span className="w-3 h-px bg-border" />
                        </div>

                        <h1 className="text-[1.1rem] font-semibold tracking-tight text-foreground">
                            Invite a member
                        </h1>
                        <p className="text-[12.5px] text-muted-foreground mt-1.5 leading-relaxed">
                            Send an invitation to a personal email address. They'll be added to this
                            workspace once accepted.
                        </p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase">
                                Email address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary/70 transition-colors" strokeWidth={1.8} />
                                <input
                                    type="email"
                                    placeholder="example@gmail.com"
                                    autoComplete="email"
                                    {...register("email")}
                                    className="h-9 w-full border border-border bg-background pl-9 pr-3 text-[13px] placeholder:text-muted-foreground/50 transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-[11px] text-destructive tracking-tight">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase">
                                Role
                            </label>
                            <div className="flex flex-col gap-1.5">
                                {ROLE_OPTIONS.map(({ value, label, description, icon: Icon }) => {
                                    const isSelected = selectedRole === value;
                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() =>
                                                setValue("role", value, { shouldValidate: true })
                                            }
                                            className={`relative flex items-start gap-3 border px-3 py-2.5 text-left transition-all ${isSelected
                                                    ? "border-primary/50 bg-primary/[0.06]"
                                                    : "border-border bg-background hover:border-border/80 hover:bg-surface/30"
                                                }`}
                                        >
                                            <div
                                                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center border transition-colors ${isSelected
                                                        ? "border-primary/40 bg-primary/10 text-primary"
                                                        : "border-border text-muted-foreground/60"
                                                    }`}
                                            >
                                                <Icon className="size-3.5" strokeWidth={1.8} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className={`text-[13px] font-medium tracking-tight ${isSelected ? "text-foreground" : "text-foreground/80"
                                                        }`}
                                                >
                                                    {label}
                                                </p>
                                                <p className="text-[11.5px] text-muted-foreground/70 leading-snug mt-0.5">
                                                    {description}
                                                </p>
                                            </div>

                                            <div
                                                className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${isSelected
                                                        ? "border-primary bg-primary"
                                                        : "border-border/70"
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <Check className="size-2.5 text-primary-foreground" strokeWidth={3} />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Hidden field keeps react-hook-form registration intact for validation */}
                            <input type="hidden" {...register("role")} />
                            {errors.role && (
                                <p className="text-[11px] text-destructive tracking-tight">
                                    {errors.role.message}
                                </p>
                            )}
                        </div>

                        <div className="mt-2 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setInviteModalVisibility((prev) => !prev)}
                                className="h-9 px-4 border border-border text-[12px] font-medium text-muted-foreground hover:bg-surface/40 hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="h-9 px-4 bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 transition-colors disabled:cursor-not-allowed disabled:opacity-60 border border-primary/70"
                            >
                                {isPending ? "Sending invite…" : "Send Invite"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};