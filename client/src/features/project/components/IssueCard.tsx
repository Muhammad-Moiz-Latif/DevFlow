import { PriorityBadge } from "../../../components/ui/badges";
import { useDraggable } from '@dnd-kit/react';


type IssuePropType = {
    id: string,
    title: string,
    description: string,
    status: string,
    priority: string
};


const IssueCard = (props: IssuePropType) => {
    const { ref, isDragging } = useDraggable({
        id: props.id,
    });



    return (
        <div
            ref={ref}
            className={`bg-surface-elevated border border-border rounded-lg p-2 hover:border-primary/50 transition-all hover:shadow-lg cursor-grab active:cursor-grabbing group ${isDragging ? 'opacity-50' : ''
                }`}
        >
            <div className="flex items-start justify-between gap-1.5 mb-1.5">
                <h3 className="text-xs font-semibold text-foreground line-clamp-2 flex-1 group-hover:text-primary transition-colors">
                    {props.title}
                </h3>
                <PriorityBadge priority={props.priority.toLowerCase() as "urgent" | "high" | "medium" | "low"} compact />
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 leading-tight">
                {props.description}
            </p>
        </div>
    )
}

export default IssueCard