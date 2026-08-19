import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { X, Mail } from "lucide-react";
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
        formState: { errors },
    } = useForm<InviteMemberSchemaType>({
        resolver: zodResolver(InviteMemberSchema),
        defaultValues: { role: "MEMBER" },
    });
    const { mutate, isPending } = useInviteMember();

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
            className="fixed inset-0 z-70 flex items-center justify-center bg-background/60 backdrop-blur-sm"
            onClick={() => setInviteModalVisibility((prev) => !prev)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md border border-border bg-card overflow-hidden"
            >
                {/* Header bar */}
                <div className="h-10 border-b border-border bg-sidebar/50 flex items-center px-4 gap-2.5">
                    <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase">
                        Invite
                    </span>
                    <span className="text-[10px] font-mono text-foreground/70">New member</span>
                    <button
                        type="button"
                        onClick={() => setInviteModalVisibility((prev) => !prev)}
                        aria-label="Close"
                        className="ml-auto size-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
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
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" strokeWidth={1.8} />
                                <input
                                    type="email"
                                    placeholder="example@gmail.com"
                                    autoComplete="email"
                                    {...register("email")}
                                    className="h-9 w-full border border-border bg-background pl-9 pr-3 text-[13px] placeholder:text-muted-foreground/50 transition-colors focus:border-primary/40 focus:outline-none"
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
                            <select
                                {...register("role")}
                                className="h-9 w-full cursor-pointer border border-border bg-background px-3 text-[13px] text-foreground transition-colors focus:border-primary/40 focus:outline-none"
                            >
                                <option value="ADMIN">Admin</option>
                                <option value="MEMBER">Member</option>
                                <option value="VIEWER">Viewer</option>
                            </select>
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