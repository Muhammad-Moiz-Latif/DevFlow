import { useState } from "react";
import { Building2, Mail, ArrowRight, Check, Sparkles } from "lucide-react";
import { Link } from "react-router";


const pendingInvites = [
    { workspace: "Acme Corp", inviter: "Sarah Kim", role: "Member", slug: "acme" },
    { workspace: "Helix Labs", inviter: "Marcus Lee", role: "Viewer", slug: "helix" },
];

export function CreateWorkspace() {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    const handleNameChange = (v: string) => {
        setName(v);
        setSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!slug) return;
        // navigate({ to: "/w/$workspaceSlug", params: { workspaceSlug: slug } });
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <div className="absolute inset-0 -z-10 opacity-40" style={{
                backgroundImage: "radial-gradient(circle at 20% 10%, oklch(0.55 0.22 270 / 0.15), transparent 40%), radial-gradient(circle at 80% 90%, oklch(0.65 0.18 200 / 0.12), transparent 40%)"
            }} />

            <div className="w-full max-w-2xl">
                <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                    <div className="size-7 rounded-md bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold text-xs">
                        DF
                    </div>
                    <span className="text-sm font-semibold tracking-tight">DevFlow</span>
                </Link>

                <div className="mb-8">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium mb-3">
                        <Sparkles className="size-3" />
                        Welcome
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight">Set up your workspace</h1>
                    <p className="text-sm text-muted-foreground mt-2 max-w-md">
                        Workspaces are where your team tracks issues, projects, and discussions.
                        Create a new one or accept an invitation below.
                    </p>
                </div>

                {/* Create */}
                <form onSubmit={submit} className="bg-card border border-border rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="size-8 rounded-md bg-primary/15 flex items-center justify-center">
                            <Building2 className="size-4 text-primary" />
                        </div>
                        <h2 className="text-sm font-semibold">Create a new workspace</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                                Workspace name
                            </label>
                            <input
                                value={name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="Acme Corp"
                                className="w-full h-9 px-3 rounded-md bg-surface border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                                Workspace URL
                            </label>
                            <div className="flex items-center h-9 rounded-md bg-surface border border-border overflow-hidden focus-within:ring-1 focus-within:ring-ring">
                                <span className="px-3 text-xs text-muted-foreground border-r border-border h-full flex items-center font-mono">
                                    devflow.app/w/
                                </span>
                                <input
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                                    placeholder="acme"
                                    className="flex-1 h-full px-3 bg-transparent text-sm font-mono placeholder:text-muted-foreground focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!slug}
                        className="mt-5 inline-flex items-center justify-center gap-2 w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                    >
                        Create workspace
                        <ArrowRight className="size-4" />
                    </button>
                </form>

                {/* Invitations */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="size-8 rounded-md bg-status-done/15 flex items-center justify-center">
                            <Mail className="size-4 text-status-done" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Pending invitations</h2>
                            <p className="text-[11px] text-muted-foreground">You've been invited to {pendingInvites.length} workspaces</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {pendingInvites.map((inv) => (
                            <div
                                key={inv.slug}
                                className="flex items-center gap-3 p-3 rounded-md border border-border bg-surface/40 hover:bg-surface-elevated transition-colors"
                            >
                                <div className="size-9 rounded-md bg-gradient-to-br from-primary/30 to-primary/10 border border-border flex items-center justify-center text-xs font-semibold">
                                    {inv.workspace.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium">{inv.workspace}</div>
                                    <div className="text-[11px] text-muted-foreground">
                                        Invited by {inv.inviter} · {inv.role}
                                    </div>
                                </div>
                                <Link
                                    to="/w/$workspaceSlug"
                                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
                                >
                                    <Check className="size-3.5" />
                                    Accept
                                </Link>
                                <button className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                                    Decline
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
