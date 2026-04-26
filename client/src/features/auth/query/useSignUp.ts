import { useMutation } from "@tanstack/react-query"
import { SignUp } from "../api/signup"

export const useSignUp = () => {
    return useMutation({
        mutationFn: SignUp,
        onError: (error: any) => {
            console.error(error);
        }
    });
};