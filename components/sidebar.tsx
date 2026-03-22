"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserStore } from "@/persistence/userPersistence";
import { Bell, LogOut, Calendar, ClipboardList, Settings, Home } from "lucide-react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {

    const { user, setToken, setUser } = useUserStore();
    const pathname = usePathname();

    const menuItems: Record<number, { name: string; href: string; icon: any }[]> = {
        1: [
            { name: "Consultar Reservas", href: "/reservas", icon: Calendar },
            { name: "Mis Reservas", href: "/mis-reservas", icon: ClipboardList },
        ],
        2: [
            { name: "Gestionar Solicitudes", href: "/dashboard/admin", icon: Settings },
            { name: "Gestionar Espacios", href: "/dashboard/admin/usuarios", icon: Home },
        ]
    }

    const handleName = (name: string | undefined) => {
        if (!name) return "";
        const names = name.split(" ");
        if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
        return (names[0][0] + names[1][0]).toUpperCase();
    }

    const handleLogout = () => {
        setToken("");
        setUser(null);
        window.location.href = "/auth/login";
    }

    const isActive = (href: string) => pathname === href;

    return (
        <div className="flex flex-col justify-between h-screen w-64 bg-white border-r border-gray-200">
            <div className="flex-1">
                <div className="flex flex-col gap-3 items-center justify-center pt-8 pb-6 border-b border-gray-200">
                    <Avatar size="lg" className="ring-2 ring-gray-200">
                        <AvatarFallback className="bg-gray-900 text-white font-semibold text-lg">
                            {handleName(user?.nombre)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                        <p className="font-semibold text-gray-800">{user?.nombre}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {user?.idRol === 1 ? "Usuario" : "Administrador"}
                        </p>
                    </div>
                </div>
                
                <nav className="flex flex-col gap-2 p-4 mt-2">
                    {menuItems[user?.idRol || 1].map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                                    active
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${active ? "" : "text-gray-500"}`} />
                                <span className="font-medium text-sm">{item.name}</span>
                            </a>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-gray-200 p-4 space-y-2">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => toast.info("Esta función se agregará próximamente")}
                >
                    <Bell className="w-5 h-5" />
                    <span className="text-sm font-medium">Notificaciones</span>
                </Button>
                
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Cerrar Sesión</span>
                </Button>
            </div>
        </div>
    )
}