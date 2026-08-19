import { useParams } from "react-router";
import { useCurrentWorkspace } from "../../workspace/query/useCurrentWorkspace";
import { useWorkspaceMembers } from "../query/useWorkspaceMembers";
import { MemberDetailRow } from "./memberRow";
import { Plus, Loader2, Users } from "lucide-react";
import { useState } from "react";
import { InviteMemberModal } from "./inviteMemberModal";

type MemberFilter = "all" | "active" | "pending";

export const WorkspaceMembers = () => {
    const { workspaceSlug } = useParams();
    const { data: currentWorkspaceData } = useCurrentWorkspace(workspaceSlug!);
    const { data: MembersData, isPending } = useWorkspaceMembers(currentWorkspaceData?.data?.id!);
    const [isInviteModalVisible, setInviteModalVisibility] = useState(false);
    const [filter, setFilter] = useState<MemberFilter>("all");

    if (isPending) {
        return (
            <div className="p-6 max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
                <div className="flex items-center gap-2.5 border border-border bg-card px-5 py-3">
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                    <span className="text-[12px] font-mono tracking-wide text-muted-foreground">
                        Loading members…
                    </span>
                </div>
            </div>
        );
    }

    const activeMembers = MembersData?.data!.filter((member) => member.status === "SUCCESS").length;
    const pendingMembers = MembersData?.data!.filter((member) => member.status === "PENDING").length;
    const totalMembers = MembersData?.data?.length ?? 0;
    const activeRate = totalMembers > 0 ? Math.round(((activeMembers ?? 0) / totalMembers) * 100) : 0;

    const filteredMembers = MembersData?.data?.filter((member) => {
        if (filter === "active") return member.status === "SUCCESS";
        if (filter === "pending") return member.status === "PENDING";
        return true;
    });

    return (
        <div className="p-5 md:p-6 max-w-6xl mx-auto">
            {isInviteModalVisible && (
                <InviteMemberModal
                    setInviteModalVisibility={setInviteModalVisibility}
                    workspaceId={currentWorkspaceData?.data?.id ?? ""}
                />
            )}

            {/* ── Title block ── */}
            <div className="relative mb-7 pb-5 border-b border-border">
                <div className="absolute top-0 left-0 size-2 border-t border-l border-primary/40" />
                <div className="absolute top-0 right-0 size-2 border-t border-r border-primary/40" />

                <div className="flex items-start justify-between gap-4 p-2">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-3 mb-3 text-[10px] font-mono tracking-[0.14em] text-muted-foreground/55 uppercase">
                            <span className="w-4 h-px bg-border" />
                            Fig. 14 — Members
                            <span className="w-4 h-px bg-border" />
                            <span className="text-muted-foreground/40">People</span>
                            <span className="w-px h-2.5 bg-border/50" />
                            <span className="flex items-center gap-1.5 text-primary/70 normal-case tracking-wide">
                                <span className="size-1 rounded-full bg-primary animate-pulse" />
                                {totalMembers} total
                            </span>
                        </div>

                        <h1 className="text-[1.5rem] md:text-[1.65rem] font-semibold tracking-[-0.03em] leading-tight">
                            Members
                        </h1>

                        <p className="text-[13.5px] text-muted-foreground mt-1.5 leading-relaxed">
                            <span className="text-foreground font-medium">{activeMembers}</span> active
                            {pendingMembers! > 0 && (
                                <>
                                    {" "}
                                    ·{" "}
                                    <span className="text-muted-foreground/80 font-medium">
                                        {pendingMembers} pending
                                    </span>
                                </>
                            )}
                        </p>
                    </div>

                    {currentWorkspaceData?.data?.yourRole === "ADMIN" && (
                        <button
                            type="button"
                            onClick={() => setInviteModalVisibility((prev) => !prev)}
                            className="group inline-flex items-center gap-2 h-9 px-4 border border-border/80 bg-card text-[12px] font-medium text-foreground/85 hover:border-border hover:bg-surface/40 transition-colors shrink-0"
                        >
                            <Plus
                                className="size-3.5 text-muted-foreground/60 group-hover:text-foreground/80 transition-colors"
                                strokeWidth={1.8}
                            />
                            <span>Invite member</span>
                        </button>
                    )}
                </div>
            </div>

            {/* ── Instrument strip — doubles as the filter control ── */}
            <div className="grid grid-cols-3 gap-px bg-border border border-border mb-4">
                <StatCell
                    label="Total"
                    value={totalMembers}
                    hint="All"
                    tone="primary"
                    active={filter === "all"}
                    onClick={() => setFilter("all")}
                />
                <DialCell
                    value={activeRate}
                    label="Active"
                    total={totalMembers}
                    active={filter === "active"}
                    onClick={() => setFilter("active")}
                />
                <StatCell
                    label="Pending"
                    value={pendingMembers ?? 0}
                    hint="Invited"
                    tone="done"
                    active={filter === "pending"}
                    onClick={() => setFilter("pending")}
                />
            </div>

            {/* Active filter indicator */}
            {filter !== "all" && (
                <div className="flex items-center gap-2 mb-3 -mt-1">
                    <span className="text-[9px] font-mono tracking-[0.1em] text-muted-foreground/45 uppercase">
                        Filtered · {filter}
                    </span>
                    <button
                        onClick={() => setFilter("all")}
                        className="text-[9px] font-mono tracking-[0.1em] text-primary/70 hover:text-primary uppercase transition-colors"
                    >
                        Clear
                    </button>
                </div>
            )}

            {/* ── Members table ── */}
            <div className="border border-border bg-card overflow-hidden">
                {/* Header row */}
                <div className="h-9 border-b border-border bg-sidebar/40 grid grid-cols-[minmax(0,1fr)_120px_140px_44px] items-center px-4 gap-3">
                    <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase">
                        Name
                    </span>
                    <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase text-center">
                        Role
                    </span>
                    <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase text-center">
                        Joined
                    </span>
                    <span />
                </div>

                {filteredMembers && filteredMembers.length > 0 ? (
                    <div className="divide-y divide-border">
                        {filteredMembers.map((member) => (
                            <MemberDetailRow key={member.id} data={member} />
                        ))}
                    </div>
                ) : totalMembers === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-1.5">
                        <Users className="size-6 text-muted-foreground/25" strokeWidth={1.5} />
                        <p className="text-[13px] text-muted-foreground/60 tracking-tight">
                            No members yet
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground/40 tracking-wide">
                            Invite your team to get started
                        </p>
                        {currentWorkspaceData?.data?.yourRole === "ADMIN" && (
                            <button
                                onClick={() => setInviteModalVisibility(true)}
                                className="mt-4 h-9 px-4 bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 inline-flex items-center gap-1.5 transition-colors border border-primary/70"
                            >
                                <Plus className="size-3.5" strokeWidth={2} />
                                Invite member
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-1.5">
                        <p className="text-[13px] text-muted-foreground/60 tracking-tight">
                            No {filter} members
                        </p>
                        <button
                            onClick={() => setFilter("all")}
                            className="text-[10px] font-mono text-primary/70 hover:text-primary uppercase tracking-wide transition-colors mt-1"
                        >
                            Show all members
                        </button>
                    </div>
                )}
            </div>

            {/* ── Sheet footer ── */}
            <div className="mt-6 flex items-center justify-between text-[9px] font-mono tracking-[0.12em] text-muted-foreground/30 uppercase border-t border-border/50 pt-3">
                <span>Sheet 01 / 01</span>
                <div className="flex items-center gap-2.5">
                    <span>v2.0.1</span>
                    <span className="w-px h-2 bg-border/40" />
                    <span>devflow.app</span>
                    <span className="w-px h-2 bg-border/40" />
                    <span className="flex items-center gap-1.5">
                        <span className="size-1 rounded-full bg-status-progress" />
                        {activeMembers} active
                    </span>
                </div>
            </div>
        </div>
    );
};

function StatCell({
    label,
    value,
    hint,
    tone,
    active,
    onClick,
}: {
    label: string;
    value: number;
    hint: string;
    tone: "progress" | "urgent" | "done" | "primary";
    active?: boolean;
    onClick?: () => void;
}) {
    const toneClass = {
        progress: "text-status-progress",
        urgent: "text-priority-urgent",
        done: "text-status-done",
        primary: "text-primary",
    }[tone];

    return (
        <button
            onClick={onClick}
            className={`text-left bg-background px-4 py-3.5 transition-colors ${active ? "bg-surface/50" : "hover:bg-surface/25"
                }`}
        >
            <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-mono tracking-[0.1em] uppercase ${active ? "text-foreground/70" : "text-muted-foreground/50"}`}>
                    {label}
                </span>
                <span className={`text-[10px] font-mono ${toneClass}`}>{hint}</span>
            </div>
            <div className="text-[1.4rem] font-semibold tracking-[-0.02em] tabular-nums">
                {value}
            </div>
        </button>
    );
}

/* ── Dial cell — same signature instrument as Dashboard / Projects ── */
function DialCell({
    value,
    label,
    total,
    active,
    onClick,
}: {
    value: number;
    label: string;
    total: number;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`text-left bg-background px-4 py-3.5 flex items-center gap-3 transition-colors ${active ? "bg-surface/50" : "hover:bg-surface/25"
                }`}
        >
            <div
                className="relative size-10 shrink-0 rounded-full"
                style={{
                    background: `conic-gradient(oklch(0.72 0.20 290) ${value * 3.6}deg, oklch(1 0 0 / 0.08) 0deg)`,
                }}
            >
                <div className="absolute inset-[3px] rounded-full bg-background flex items-center justify-center">
                    <span className="text-[9px] font-mono font-semibold tabular-nums">
                        {value}%
                    </span>
                </div>
            </div>
            <div className="min-w-0">
                <span className={`block text-[10px] font-mono tracking-[0.1em] uppercase ${active ? "text-foreground/70" : "text-muted-foreground/50"}`}>
                    {label}
                </span>
                <span className="block text-[10px] font-mono text-muted-foreground/60 mt-1">
                    of {total} total
                </span>
            </div>
        </button>
    );
}