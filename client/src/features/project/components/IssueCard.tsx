import { PriorityBadge, Avatar } from "../../../components/ui/badges";
import { useSortable } from '@dnd-kit/react/sortable';
import { Calendar } from "lucide-react";



type IssuePropType = {
    id: string,
    title: string,
    description: string,
    status: string,
    priority: string,
    dueDate: Date,
    assignedTo: {
        id: string;
        name: string;
        email: string;
        img: string;
    },
    index: number,
    onClick?: () => void,
    collaborationLabel?: string,
    collaborationUsers?: Array<{
        socketId: string;
        username: string;
        img: string;
    }>
};

function formatDueDate(date: Date): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${month}/${day}`;
}

const IssueCard = (props: IssuePropType) => {
    const { ref, isDragging } = useSortable({
        id: props.id,
        index: props.index
    });

    const formattedDate = props.dueDate ? formatDueDate(props.dueDate) : null;

    return (
        <button
            ref={ref}
            onClick={props.onClick}
            className={`w-full text-left bg-surface-elevated border border-border rounded-lg p-2.5 hover:border-primary/50 transition-all hover:shadow-lg cursor-grab active:cursor-grabbing group ${isDragging ? 'opacity-50' : ''
                }`}
        >
            <div className="flex items-start justify-between gap-1.5 mb-1.5">
                <h3 className="text-xs font-semibold text-foreground line-clamp-2 flex-1 group-hover:text-primary transition-colors">
                    {props.title}
                </h3>
                <div className="flex items-center gap-1">
                    {props.collaborationLabel && (
                        <span className="inline-flex items-center rounded-full border border-border/60 bg-background/85 px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm">
                            {props.collaborationLabel}
                        </span>
                    )}
                    <PriorityBadge priority={props.priority.toLowerCase() as "urgent" | "high" | "medium" | "low"} compact />
                </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 leading-tight mb-2">
                {props.description}
            </p>
            <div className="flex items-center justify-between">
                {formattedDate && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Calendar className="size-3" />
                        {formattedDate}
                    </span>
                )}
                <div className="ml-auto">
                    {props.assignedTo && <Avatar name={props.assignedTo.name} size={20} />}
                </div>
            </div>
        </button>
    )
}

export default IssueCard