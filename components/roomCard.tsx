"use client";

import { Button } from "@/components/ui/button";
import { Rooms } from "@/types/rooms";
import { MapPin, Users, Package, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoomCardProps {
    room: Rooms;
    onSelect: (room: Rooms) => void;
    isEdit?: boolean;
}

export const RoomCard = ({ room, onSelect, isEdit }: RoomCardProps) => {
    return (
        <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200">
            <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
                {room.urlImagen ? (
                    <>
                        <img
                            src={room.urlImagen}
                            alt={room.nombre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-400" />
                    </div>
                )}
                <Badge className="absolute top-3 right-3 bg-white text-gray-800 shadow-sm">
                    {room.capacidad || "N/A"} personas
                </Badge>
            </div>

            <div className="p-5 space-y-4">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {room.nombre || "Sin nombre"}
                    </h3>
                    {room.ubicacion && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{room.ubicacion}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    {room.equipamento && (
                        <div className="flex items-start gap-2 text-sm">
                            <Package className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                            <span className="text-gray-600">{room.equipamento}</span>
                        </div>
                    )}
                    {room.capacidad && (
                        <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Capacidad: {room.capacidad} personas</span>
                        </div>
                    )}
                </div>

                <Button
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white transition-colors"
                    onClick={() => onSelect(room)}
                >
                    {isEdit ? "Editar Espacio" : "Reservar Ahora"}
                </Button>
            </div>
        </div>
    );
};
