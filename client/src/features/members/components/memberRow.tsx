import type { WorkspaceMember } from "../../types";
import { Avatar, RoleBadge } from "../../../components/ui/badges";
import { MoreHorizontal } from "lucide-react";

export const MemberDetailRow = ({ data }: { data: WorkspaceMember }) => {
    // Convert the string into a valid Date object
    const date = new Date(data.joinedAt);

    // Format the date to show only the Month and Year
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "long", // Use 'short' for Jul, or 'numeric' for 07
        year: "numeric",
    }).format(date);

    const roleLabel: "Admin" | "Member" | "Viewer" =
        data.role === "ADMIN" ? "Admin" : data.role === "MEMBER" ? "Member" : "Viewer";

    return (
        <div className="grid grid-cols-[minmax(0,1fr)_120px_140px_44px] items-center gap-3 px-4 py-3 hover:bg-surface/30 transition-colors group">
            <div className="flex min-w-0 items-center gap-3">
                {data.user.img ? (
                    <img
                        src={data.user.img}
                        alt={data.user.name}
                        className="size-7 rounded-full object-cover ring-1 ring-border"
                    />
                ) : (
                    <Avatar name={data.user.name} size={28} />
                )}
                <div className="min-w-0">
                    <h2 className="truncate text-[13px] font-medium text-foreground/90 group-hover:text-foreground transition-colors">
                        {data.user.name}
                    </h2>
                    <p className="truncate text-[11px] text-muted-foreground/70">{data.user.email}</p>
                </div>
            </div>

            <div className="flex justify-center">
                <RoleBadge role={roleLabel} />
            </div>

            <div className="text-center text-[11px] font-mono text-muted-foreground/60 tracking-wide">
                {formattedDate}
            </div>

            <button
                type="button"
                className="flex size-8 items-center justify-center text-muted-foreground/50 transition-colors hover:text-foreground"
                aria-label={`Open actions for ${data.user.name}`}
            >
                <MoreHorizontal className="size-4" strokeWidth={1.8} />
            </button>
        </div>
    );
};