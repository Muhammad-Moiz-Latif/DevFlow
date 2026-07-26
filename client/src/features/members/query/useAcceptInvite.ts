import { useMutation } from "@tanstack/react-query"
import { AcceptInviteApi } from "../api/acceptInviteApi"

export const useAcceptInvite = () => {
    return useMutation({
        mutationFn: (token: string | null) => AcceptInviteApi(token),
        onError: (error) => {
            console.error(error)
        }
    });
;}