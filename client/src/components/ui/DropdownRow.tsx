import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate, useParams } from "react-router";
import type { NotificationItem } from "../../features/types";
import { useCurrentWorkspace } from "../../features/workspace/query/useCurrentWorkspace";
import { useUpdateNotification } from "../../features/members/query/useUpdateNotification";


export const DropdownRow = ({ data, setIsDropDownActive }: { data: NotificationItem, setIsDropDownActive: Dispatch<SetStateAction<boolean>> }) => {
    const { workspaceSlug } = useParams();
    const { data: workspaceData } = useCurrentWorkspace(workspaceSlug!);
    const workspaceId = workspaceData?.data?.id ?? "";
    const rowElement = useRef<HTMLButtonElement | null>(null);
    const [visibility, setVisibility] = useState(false);
    const { mutate } = useUpdateNotification(workspaceId, data.id);
    const navigate = useNavigate();


    useEffect(() => {
        const element = rowElement.current;
        if (!element) return;

        const intersectionObserver = new IntersectionObserver(([rowElement]) => {
            if (rowElement.isIntersecting) {
                setVisibility(true);
                intersectionObserver.disconnect();
            };
        }, { threshold: 1 });

        intersectionObserver.observe(element);

        return () => intersectionObserver.disconnect()
    }, []);

    useEffect(() => {
        if (visibility && !data.isRead) {
            mutate();
        };
    }, [visibility, data.isRead])


    return (
        <button
            ref={rowElement}
            key={data.id}
            type="button"
            onClick={() => {
                setIsDropDownActive(false);
                navigate(data.link);
            }}
            className="w-full px-4 py-3 text-left transition-colors hover:bg-white/5"
        >
            <p className="line-clamp-2 text-sm font-medium leading-5 text-foreground">
                {data.message}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
                Open notification
            </p>
        </button>
    );
};