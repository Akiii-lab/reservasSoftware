"use client";

import { useUserStore } from "@/persistence/userPersistence";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {

    const { user, _hasHydrated } = useUserStore();
    const router = useRouter();
    useEffect(() => {
        if (!_hasHydrated) return;
        
        console.log(user);
        if (!user) {
            router.push("/auth/login");
            return;
        }
        if(user?.idRol === 2) {
            router.push("/dashboard/admin");
        }
        if(user?.idRol === 1) {
            router.push("/reservas");
        }
    }, [_hasHydrated]);

    return (
        <>
            Loading
        </>
    )
}