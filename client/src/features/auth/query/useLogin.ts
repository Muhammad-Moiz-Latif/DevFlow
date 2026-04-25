import { useMutation } from "@tanstack/react-query";
import { Login } from "../api/login";

export default function useLogin() {
    return useMutation({
        mutationFn: Login,
        onError: (error) => {
            console.error(error)
        }
    });
};