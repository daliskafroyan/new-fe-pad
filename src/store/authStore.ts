import create from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
    userDetail: any
    userAuthorization: any
    token: string | null
    expirationTime: string | null
    setUserDetail: (userDetail: any) => void
    setUserAuthorization: (userAuthorization: any) => void
    setToken: (token: string) => void
    setExpirationTime: (time: string) => void
    clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            userDetail: null,
            userAuthorization: null,
            token: null,
            expirationTime: null,
            setUserDetail: (userDetail) => set({ userDetail }),
            setUserAuthorization: (userAuthorization) => set({ userAuthorization }),
            setToken: (token) => set({ token }),
            setExpirationTime: (time) => set({ expirationTime: time }),
            clearAuth: () => set({ userDetail: null, userAuthorization: null, token: null, expirationTime: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
)