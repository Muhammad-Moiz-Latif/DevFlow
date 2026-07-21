import type { WorkspaceMember } from "../../types";
import { Avatar, RoleBadge } from "../../../components/ui/badges";
import { MoreHorizontal } from "lucide-react";


export const MemberDetailRow = ({ data }: { data: WorkspaceMember }) => {

    // Convert the string into a valid Date object
    const date = new Date(data.joinedAt);

    // Format the date to show only the Month and Year
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'long', // Use 'short' for Jul, or 'numeric' for 07
        year: 'numeric'
    }).format(date);

    const roleLabel: "Admin" | "Member" | "Viewer" = data.role === 'ADMIN' ? 'Admin' : data.role === 'MEMBER' ? 'Member' : 'Viewer';

    return (
        <div className="grid grid-cols-[minmax(0,1fr)_140px_160px_48px] items-center gap-4 px-6 py-6 transition-colors hover:bg-white/1.5">
            <div className="flex min-w-0 items-center gap-4">
                {data.user.img ? (
                    <img src={data.user.img} alt={data.user.name} className="size-8 rounded-full object-cover ring-1 ring-border" />
                ) : (
                    <Avatar name={data.user.name} size={40} />
                )}
                <div className="min-w-0">
                    <h2 className="truncate text-[15px] font-semibold text-foreground">{data.user.name}</h2>
                    <p className="truncate text-xs text-muted-foreground">{data.user.email}</p>
                </div>
            </div>

            <div className="flex justify-center">
                <RoleBadge role={roleLabel} />
            </div>

            <div className="text-center text-xs text-muted-foreground">
                {formattedDate}
            </div>

            <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                aria-label={`Open actions for ${data.user.name}`}
            >
                <MoreHorizontal className="size-5" />
            </button>
        </div>
    );
};