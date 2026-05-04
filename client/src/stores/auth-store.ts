// stores/auth-store.ts
import { create } from 'zustand'

type User = {
    _id: string
    image: string
    username: string
}

type AuthStore = {
    user: User | null
    accessToken: string | null
    setAuth: (user: User, token: string) => void
    setAccessToken: (token: string) => void
    clearAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    accessToken: null,
    setAuth: (user, accessToken) => set({ user, accessToken }),
    setAccessToken: (accessToken) => set({ accessToken }),
    clearAuth: () => set({ user: null, accessToken: null })
}))