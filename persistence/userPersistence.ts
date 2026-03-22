import { UserLogin } from "@/types/user";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserStore {
    user: UserLogin | null;
    token: string | null;
    setUser: (user: UserLogin | null) => void;
    setToken: (token: string) => void;
    clearUser: () => void;
    clearToken: () => void;
    _hasHydrated: boolean;
    setHasHydrated: (hasHydrated: boolean) => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            _hasHydrated: false,
            setUser: (user: UserLogin | null) => set({ user }),
            setToken: (token: string | null) => set({ token }),
            clearUser: () => set({ user: null }),
            clearToken: () => set({ token: null }),
            setHasHydrated: (hasHydrated: boolean) => set({ _hasHydrated: hasHydrated }),
        }),
        {
            name: "user-store",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);