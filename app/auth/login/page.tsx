"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { config } from "@/config/config";
import { useUserStore } from "@/persistence/userPersistence";
import { LoginResponse } from "@/types/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LogIn, Mail, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function Login() {

    const [showNote, setShowNote] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setUser, setToken } = useUserStore();

    const handleLogin = async() => {
        try {
            setLoading(true);
            const res = await fetch(config.ApiUrl + "/Auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                throw new Error("Error en la solicitud de inicio de sesión");
            }

            const data: LoginResponse = await res.json();
            
            if (data.token && data.user) {
                setUser(data.user);
                setToken(data.token);
                setLoading(false);
                router.push("/dashboard");
            }

        } catch (error) {
            setLoading(false);
            toast.error("Error al iniciar sesión contraseña o correo incorrecto");
            console.log(error);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md px-6">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="flex justify-center">
                            <div className="p-3 bg-gray-900 rounded-lg">
                                <LogIn className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-semibold text-gray-900">
                            Bienvenido
                        </h1>
                        <p className="text-gray-500 text-sm">Inicia sesión para continuar</p>
                    </div>

                    {showNote && (
                        <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                            <p className="text-xs text-gray-700">
                                💡 Prueba con: <span className="font-semibold">admin@admin.com</span> o <span className="font-semibold">user@user.com</span> | Contraseña: <span className="font-semibold">password</span>
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Correo Electrónico
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setShowNote(true)}
                                    onBlur={() => setShowNote(false)}
                                    placeholder="correo@ejemplo.com"
                                    className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Contraseña
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                />
                            </div>
                        </div>
                    </div>

                    <Button 
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Iniciando sesión...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <LogIn className="w-5 h-5" />
                                Ingresar
                            </div>
                        )}
                    </Button>
                </div>

                <p className="text-center text-xs text-gray-500 mt-6">
                    2026 Sistema de Reservas.
                </p>
            </div>
        </div>
    )
}