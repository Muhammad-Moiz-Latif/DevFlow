import { useMutation } from "@tanstack/react-query"
import { VerifyEmail } from "../api/verifyEmail"

export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: VerifyEmail,
        onError: (error) => {
            console.error(error);
        }
    });
};