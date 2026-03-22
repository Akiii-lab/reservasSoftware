"use client";

import { CreateReservation } from "@/components/createReservation";
import { RoomCard } from "@/components/roomCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { config } from "@/config/config";
import { useUserStore } from "@/persistence/userPersistence";
import { AvialableResponse } from "@/types/reserve";
import { Rooms, CreateReservation as CreateReservationType } from "@/types/rooms";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";

export default function Reservas() {
    const { user, token } = useUserStore();
    const [espacios, setEspacios] = useState<Rooms[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Rooms | null>(null);
    const [showCreateReservation, setShowCreateReservation] = useState(false);

    useEffect(() => {
        fetchEspacios();
    }, []);

    const fetchEspacios = async () => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }

    const handleDateSelected = async (date: string) => {
        try {
            const res = await fetch(config.ApiUrl + `/Reserve/room/${selectedRoom?.id}/availability?date=${date}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Error al obtener la disponibilidad");
            }

            const data: AvialableResponse = await res.json();
            return data;
        }
        catch (error) {
            toast.error("Error al obtener la disponibilidad");
            console.log(error);
            return null;
        }
    }

    const handleSubmitForm = async (data: CreateReservationType) => {
        try {
            setLoading(true);
            const res = await fetch(config.ApiUrl + "/Reserve/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    idUsuario: user?.id,
                    idRoom: selectedRoom?.id,
                    fecha: data.fecha,
                    horaInicio: data.horaInicio,
                    horaFin: data.horaFin
                })
            });

            if (!res.ok) {
                throw new Error("Error al reservar el espacio");
            }

            toast.success("Reserva creada con éxito", {
                duration: 3000
            })

        }
        catch (error) {
            toast.error("Error al reservar el espacio");
            console.log(error);
        } finally {
            setLoading(false);
            fetchEspacios();
        }
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Search className="w-8 h-8 text-gray-900" />
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Reservar Espacios
                    </h1>
                </div>
                <p className="text-gray-600">Encuentra y reserva el espacio perfecto para tu evento</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    <Input 
                        placeholder="Nombre del espacio" 
                        className="md:col-span-2"
                    />
                    <Select>
                        <SelectTrigger>
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
                    <Input placeholder="Capacidad" type="number" />
                    <Button 
                        className="md:col-span-2 bg-gray-900 hover:bg-gray-800"
                        onClick={() => toast.info("Esta función se agregará próximamente")}
                    >
                        <Search className="w-4 h-4 mr-2" />
                        Buscar
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-600">Cargando espacios disponibles...</p>
                </div>
            ) : espacios.length === 0 ? (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                    <p className="text-gray-600 text-lg">No hay espacios disponibles</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {espacios.map((espacio) => (
                        <RoomCard
                            key={espacio.id}
                            room={espacio}
                            onSelect={(room) => {
                                setSelectedRoom(room);
                                setShowCreateReservation(true);
                            }}
                        />
                    ))}
                </div>
            )}

            <CreateReservation
                open={showCreateReservation && selectedRoom !== null}
                setOpen={setShowCreateReservation}
                room={selectedRoom!}
                handleSubmit={handleSubmitForm}
                selectDate={handleDateSelected}
            />
        </div>
    )
}