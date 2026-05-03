import { TrendingUp, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { PriorityBadge, StatusBadge, Avatar } from "../../../../components/ui/badges";

export function Dashboard() {
    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <div className="text-xs text-muted-foreground mb-1">Tuesday, April 23</div>
                <h1 className="text-2xl font-semibold tracking-tight">Good afternoon, Jordan</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    You have <span className="text-foreground font-medium">7 issues</span> assigned and{" "}
                    <span className="text-foreground font-medium">3 due this week</span>.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-8">
                <Stat icon={Clock} label="Open" value="14" tone="status-progress" />
                <Stat icon={AlertCircle} label="Urgent" value="2" tone="priority-urgent" />
                <Stat icon={CheckCircle2} label="Completed" value="38" tone="status-done" />
                <Stat icon={TrendingUp} label="Velocity" value="+12%" tone="primary" />
            </div>

            <div className="grid grid-cols-3 gap-5">
                {/* My issues */}
                <div className="col-span-2 bg-card border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <h2 className="text-sm font-semibold">Assigned to you</h2>
                        <button className="text-xs text-primary hover:underline">View all</button>
                    </div>
                    <div className="divide-y divide-border">
                        {myIssues.map((i) => (
                            <div key={i.ref} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-elevated transition-colors cursor-pointer">
                                <PriorityBadge priority={i.priority as any} compact />
                                <span className="font-mono text-[10px] text-muted-foreground w-14 shrink-0">{i.ref}</span>
                                <span className="text-sm flex-1 truncate">{i.title}</span>
                                <span className="text-[11px] text-muted-foreground hidden md:inline">{i.project}</span>
                                <StatusBadge status={i.status as any} />
                                <span className="text-[11px] text-muted-foreground w-12 text-right">{i.due}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                        <h2 className="text-sm font-semibold">Activity</h2>
                    </div>
                    <div className="p-4 space-y-3.5">
                        {activity.map((a, i) => (
                            <div key={i} className="flex gap-2.5">
                                <Avatar name={a.name} size={24} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-foreground/85 leading-snug">
                                        <span className="font-semibold text-foreground">{a.name}</span> {a.text}
                                    </p>
                                    <span className="text-[10px] text-muted-foreground">{a.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Stat({ icon: Icon, label, value, tone }: any) {
    return (
        <div className="bg-card border border-border rounded-lg p-4">
            <div className={`size-7 rounded-md bg-${tone}/15 flex items-center justify-center mb-3`}>
                <Icon className={`size-4 text-${tone}`} />
            </div>
            <div className="text-2xl font-semibold tracking-tight">{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
        </div>
    );
}

const myIssues = [
    { ref: "DEV-241", title: "Refactor OAuth flow for mobile session persistence", project: "Mobile App", priority: "high", status: "progress", due: "Apr 25" },
    { ref: "DEV-238", title: "Empty state for projects list when no projects exist", project: "Web App", priority: "medium", status: "todo", due: "Apr 28" },
    { ref: "DEV-235", title: "Fix race condition in real-time presence indicator", project: "Realtime", priority: "urgent", status: "review", due: "Apr 24" },
    { ref: "DEV-229", title: "Add keyboard shortcuts for kanban navigation", project: "Web App", priority: "low", status: "todo", due: "May 02" },
    { ref: "DEV-221", title: "Migrate notifications table to partitioned schema", project: "Infra", priority: "medium", status: "progress", due: "Apr 30" },
];

const activity = [
    { name: "Sarah Kim", text: "moved DEV-241 to In Progress", time: "2 minutes ago" },
    { name: "Marcus Lee", text: "commented on DEV-235", time: "18 minutes ago" },
    { name: "Priya Patel", text: "created project Design System v2", time: "1 hour ago" },
    { name: "Alex Chen", text: "invited 2 new members", time: "3 hours ago" },
    { name: "Sarah Kim", text: "closed DEV-219 as Done", time: "Yesterday" },
];
