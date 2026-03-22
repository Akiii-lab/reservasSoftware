"use client";

import { CreateRoom } from "@/components/createRoom";
import { RoomCard } from "@/components/roomCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { config } from "@/config/config";
import { useUserStore } from "@/persistence/userPersistence";
import { CreateRoom as CreateRoomType, Rooms } from "@/types/rooms";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, Plus, Settings, Loader2 } from "lucide-react";
export default function AdminDashboard() {
    const { user, token } = useUserStore();
    const [espacios, setEspacios] = useState<Rooms[]>([]);
    const [showCreateRoom, setShowCreateRoom] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEspacios();
    }, []);

    const fetchEspacios = async () => {
        try {
            const res = await fetch(config.ApiUrl + "/Room", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Error al obtener los espacios");
            }

            const data: Rooms[] = await res.json();
            setEspacios(data);
        }
        catch (error) {
            toast.error("Error al obtener los espacios");
            console.log(error);
        }
    }

    const handleSubmitForm = async (data: CreateRoomType) => {
        try {
            setLoading(true);
            const res = await fetch(config.ApiUrl + "/Room/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: data.nombre,
                    capacidad: data.capacidad,
                    idTipo: data.id_tipo,
                    horaInicial: data.HoraInicio,
                    horaFinal: data.HoraFin,
                    ubicacion: data.ubicacion,
                    equipamento: data.equipamento,
                    urlImagen: data.urlImagen
                })
            });

            if (!res.ok) {
                throw new Error("Error al crear el espacio");
            }
        }
        catch (error) {
            toast.error("Error al crear el espacio");
            console.log(error);
        } finally {
            setLoading(false);
            setShowCreateRoom(false);
            fetchEspacios();
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Settings className="w-8 h-8 text-gray-900" />
                        <h1 className="text-3xl font-semibold text-gray-900">
                            Gestión de Espacios
                        </h1>
                    </div>
                    <p className="text-gray-600">Administra todos los espacios disponibles para reserva</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 mb-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input 
                                placeholder="Buscar por nombre del espacio" 
                                className="pl-10"
                            />
                        </div>
                        <Select>
                            <SelectTrigger className="lg:w-48">
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Tipo de espacio</SelectLabel>
                                    <SelectItem value="1">Sala de reuniones</SelectItem>
                                    <SelectItem value="2">Auditorio</SelectItem>
                                    <SelectItem value="3">Espacio abierto</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Input 
                            placeholder="Capacidad mínima" 
                            type="number" 
                            className="lg:w-40"
                        />
                        <Input 
                            placeholder="Hora inicio" 
                            type="time" 
                            className="lg:w-32"
                        />
                        <Input 
                            placeholder="Hora fin" 
                            type="time" 
                            className="lg:w-32"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6">
                            <Search className="w-4 h-4 mr-2" />
                            Buscar
                        </Button>
                        <Button 
                            className="bg-gray-800 hover:bg-gray-700 text-white px-6" 
                            onClick={() => setShowCreateRoom(!showCreateRoom)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Crear espacio
                        </Button>
                    </div>
                </div>
                <div>
                    {espacios.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No hay espacios disponibles</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {espacios.map((espacio) => (
                                <RoomCard 
                                    key={espacio.id} 
                                    room={espacio}
                                    onSelect={(room) => toast.info(`Función de edición para ${room.nombre} próximamente`)}
                                    isEdit={true}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <CreateRoom
                open={showCreateRoom}
                setOpen={() => setShowCreateRoom(!showCreateRoom)}
                handleSubmit={handleSubmitForm}
            />
        </>
    )
}