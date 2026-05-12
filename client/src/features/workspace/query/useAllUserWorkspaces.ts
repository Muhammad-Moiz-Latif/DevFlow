import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "../../../stores/auth-store"
import { getUserWorkspaces } from "../api/get-user-workspaces";

export const useUserWorkspaces = () => {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: ['all-workspaces', user?._id],
        queryFn: () => getUserWorkspaces(),
    });
};