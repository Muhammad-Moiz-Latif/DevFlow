import { AlertCircle, ArrowUp, Minus, ArrowDown } from "lucide-react";

export type Priority = "urgent" | "high" | "medium" | "low";
export type Status = "todo" | "progress" | "review" | "done";

const priorityConfig = {
    urgent: { label: "Urgent", icon: AlertCircle, color: "text-priority-urgent", bg: "bg-priority-urgent/15" },
    high: { label: "High", icon: ArrowUp, color: "text-priority-high", bg: "bg-priority-high/15" },
    medium: { label: "Medium", icon: Minus, color: "text-priority-medium", bg: "bg-priority-medium/15" },
    low: { label: "Low", icon: ArrowDown, color: "text-priority-low", bg: "bg-priority-low/15" },
};

const statusConfig = {
    todo: { label: "To Do", color: "text-status-todo", dot: "bg-status-todo" },
    progress: { label: "In Progress", color: "text-status-progress", dot: "bg-status-progress" },
    review: { label: "In Review", color: "text-status-review", dot: "bg-status-review" },
    done: { label: "Done", color: "text-status-done", dot: "bg-status-done" },
};

export function PriorityBadge({ priority, compact = false }: { priority: Priority; compact?: boolean }) {
    const cfg = priorityConfig[priority];
    const Icon = cfg.icon;
    if (compact) {
        return (
            <div className={`inline-flex items-center justify-center size-5 rounded ${cfg.bg}`} title={cfg.label}>
                <Icon className={`size-3 ${cfg.color}`} strokeWidth={2.5} />
            </div>
        );
    }
    return (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium ${cfg.bg} ${cfg.color}`}>
            <Icon className="size-3" strokeWidth={2.5} />
            {cfg.label}
        </span>
    );
}

export function StatusBadge({ status }: { status: Status }) {
    const cfg = statusConfig[status];
    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/90">
            <span className={`size-2 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

export function RoleBadge({ role }: { role: "Admin" | "Member" | "Viewer" }) {
    const styles = {
        Admin: "bg-primary/15 text-primary",
        Member: "bg-status-progress/15 text-status-progress",
        Viewer: "bg-muted text-muted-foreground",
    };
    return (
        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${styles[role]}`}>
            {role}
        </span>
    );
}

export function Avatar({ name, size = 24 }: { name: string; size?: number }) {
    const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    const colors = [
        "from-rose-400 to-pink-600",
        "from-amber-400 to-orange-600",
        "from-emerald-400 to-teal-600",
        "from-sky-400 to-indigo-600",
        "from-violet-400 to-purple-600",
        "from-fuchsia-400 to-rose-600",
    ];
    const idx = name.charCodeAt(0) % colors.length;
    return (
        <div
            className={`rounded-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white font-semibold ring-1 ring-background shrink-0`}
            style={{ width: size, height: size, fontSize: size * 0.42 }}
            title={name}
        >
            {initials}
        </div>
    );
}
