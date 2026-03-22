"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CreateReservation as CreateReservationType, Rooms } from "@/types/rooms";
import { getHourRange, HOURS, toBackendFormat, toDisplayFormat } from "@/utils/getHourRange";
import { AvialableResponse } from "@/types/reserve";
import { Calendar, Clock, MapPin, Users, Package } from "lucide-react";

interface CreateReservationProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    room: Rooms | null;
    handleSubmit: (data: CreateReservationType) => void;
    selectDate: (date: string) => Promise<AvialableResponse | null>;
}

export const CreateReservation = ({ open, setOpen, room, handleSubmit, selectDate }: CreateReservationProps) => {

    if (!room) return null;

    const [formData, setFormData] = useState<CreateReservationType>({
        idRoom: room.id,
        fecha: "",
        horaInicio: "",
        horaFin: ""
    });

    const [startHour, setStartHour] = useState<string | null>(null);
    const [endHour, setEndHour] = useState<string | null>(null);
    const [availableData, setAvailableData] = useState<AvialableResponse | null>(null);
    const [loadingDate, setLoadingDate] = useState(false);

    const selectedHours = (() => {
        if (startHour && endHour) {
            return getHourRange(startHour, endHour);
        } else if (startHour) {
            return [startHour];
        }
        return [];
    })();

    const getOccupiedHours = (): string[] => {
        if (!availableData) return [];
        
        const occupied: string[] = [];
        availableData.franjasReservadas.forEach(franja => {
            const horaInicio = toDisplayFormat(franja.horaInicio);
            const horaFin = toDisplayFormat(franja.horaFin);
            
            const startIdx = HOURS.indexOf(horaInicio);
            const endIdx = HOURS.indexOf(horaFin);
            if (startIdx !== -1 && endIdx !== -1) {
                const [minIdx, maxIdx] = startIdx <= endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
                for (let i = minIdx; i <= maxIdx; i++) {
                    occupied.push(HOURS[i]);
                }
            }
        });
        return occupied;
    };

    const occupiedHours = getOccupiedHours();

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setFormData(prev => ({ ...prev, fecha: date }));
        
        if (date) {
            setLoadingDate(true);
            selectDate(date).then(data => {
                setAvailableData(data);
                setLoadingDate(false);
                setStartHour(null);
                setEndHour(null);
                setFormData(prev => ({ ...prev, horaInicio: "", horaFin: "" }));
            }).catch(() => {
                setLoadingDate(false);
            });
        }
    };

    const handleHourClick = (hour: string) => {
        if (occupiedHours.includes(hour)) return;

        if (!startHour) {
            setStartHour(hour);
            setFormData(prev => ({ ...prev, horaInicio: hour }));
        } else if (!endHour) {
            const startIdx = HOURS.indexOf(startHour);
            const endIdx = HOURS.indexOf(hour);
            
            if (endIdx > startIdx) {
                setEndHour(hour);
                setFormData(prev => ({ ...prev, horaFin: hour }));
            } else {
                setStartHour(hour);
                setEndHour(startHour);
                setFormData(prev => ({ ...prev, horaInicio: hour, horaFin: startHour }));
            }
        } else {
            setStartHour(hour);
            setEndHour(null);
            setFormData(prev => ({ ...prev, horaInicio: hour, horaFin: "" }));
        }
    };

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.fecha && formData.horaInicio && formData.horaFin) {
            const dataToSubmit = {
                ...formData,
                horaInicio: toBackendFormat(formData.horaInicio),
                horaFin: toBackendFormat(formData.horaFin)
            };
            handleSubmit(dataToSubmit);
            setStartHour(null);
            setEndHour(null);
            setFormData({
                idRoom: room.id,
                fecha: "",
                horaInicio: "",
                horaFin: "",
            });
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Reservar: {room.nombre}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitForm} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1">
                            <div className="w-full aspect-square bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">{room.urlImagen ? (
                                    <img
                                        src={room.urlImagen}
                                        alt={room.nombre}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Package className="w-24 h-24 text-gray-400" />
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 space-y-4">
                            <div>
                                <Label className="font-semibold text-sm">Ubicación</Label>
                                <p className="text-gray-700 mt-1">{room.ubicacion || "----"}</p>
                            </div>

                            <div>
                                <Label className="font-semibold text-sm">Capacidad</Label>
                                <p className="text-gray-700 mt-1">{room.capacidad || "----"}</p>
                            </div>

                            <div>
                                <Label className="font-semibold text-sm">Equipamiento</Label>
                                <p className="text-gray-700 mt-1">{room.equipamento || "----"}</p>
                            </div>

                            <div className="pt-4 border-t">
                                <Label className="block mb-3 font-semibold">Selecciona horario</Label>

                                <div className="mb-4">
                                    <Label className="text-sm">Fecha</Label>
                                    <Input
                                        type="date"
                                        value={formData.fecha}
                                        onChange={handleDateChange}
                                        required
                                        className="mt-1"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm">Inicio</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Input
                                                type="time"
                                                value={formData.horaInicio}
                                                readOnly
                                                className="flex-1 bg-gray-50"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm">Final</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Input
                                                type="time"
                                                value={formData.horaFin}
                                                readOnly
                                                className="flex-1 bg-gray-50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <Label className="block mb-3 font-semibold">Horarios disponibles</Label>
                        <div className="border border-gray-300 rounded overflow-x-auto">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        {HOURS.map(hour => {
                                            const isOccupied = occupiedHours.includes(hour);
                                            const isSelected = selectedHours.includes(hour);
                                            
                                            return (
                                                <td key={hour} className="border border-gray-300 p-0 text-center h-12">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleHourClick(hour)}
                                                        disabled={isOccupied}
                                                        className={`w-full h-full text-sm font-medium transition-colors ${
                                                            isOccupied
                                                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                                                : isSelected
                                                                    ? "bg-blue-500 text-white"
                                                                    : "bg-white hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        {hour}
                                                    </button>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {loadingDate && <p className="text-sm text-gray-500 mt-2">Cargando disponibilidad...</p>}
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={!formData.fecha || !formData.horaInicio || !formData.horaFin}>
                            Reservar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
