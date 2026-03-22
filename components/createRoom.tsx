"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CreateRoom as CreateRoomType, RoomType } from "@/types/rooms";
import { getHourRange, HOURS, toBackendFormat } from "@/utils/getHourRange";
import { config } from "@/config/config";
import { MapPin, Users, Package, Clock, Image as ImageIcon, Plus } from "lucide-react";

const ROOM_TYPES: RoomType[] = ["Sala de reuniones", "Auditorio", "Espacio abierto", "Salón"];

interface CreateRoomProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    handleSubmit: (data: CreateRoomType) => void;
}

export const CreateRoom = ({ open, setOpen, handleSubmit }: CreateRoomProps) => {
    const [formData, setFormData] = useState<CreateRoomType>({
        nombre: "",
        capacidad: 0,
        equipamento: "",
        HoraInicio: "",
        HoraFin: "",
        ubicacion: "",
        id_tipo: 0,
        urlImagen: ""
    });

    const [editingField, setEditingField] = useState<string | null>(null);
    const [startHour, setStartHour] = useState<string | null>(null);
    const [endHour, setEndHour] = useState<string | null>(null);

    const selectedHours = startHour && endHour ? getHourRange(startHour, endHour) : [];


    const handleHourClick = (hour: string) => {
        if (!startHour) {
            setStartHour(hour);
            setFormData(prev => ({ ...prev, HoraInicio: hour }));
        } else if (!endHour) {
            setEndHour(hour);
            setFormData(prev => ({ ...prev, HoraFin: hour }));
        } else {
            setStartHour(hour);
            setEndHour(null);
            setFormData(prev => ({ ...prev, HoraInicio: hour, HoraFin: "" }));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "capacidad" ? parseInt(value) || 0 : value
        }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            id_tipo: parseInt(value)
        }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const dataToSubmit = {
            ...formData,
            HoraInicio: toBackendFormat(formData.HoraInicio),
            HoraFin: toBackendFormat(formData.HoraFin)
        };
        
        handleSubmit(dataToSubmit);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Plus className="w-7 h-7 text-gray-900" />
                        <DialogTitle className="text-2xl font-semibold text-gray-900">
                            Crear Nuevo Espacio
                        </DialogTitle>
                    </div>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <Label className="text-sm font-semibold mb-2 block">Imagen del Espacio</Label>
                            <div className="w-full aspect-square bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                                {formData.urlImagen ? (
                                    <img 
                                        src={formData.urlImagen} 
                                        alt="Sala" 
                                        className="w-full h-full object-cover"
                                        onError={() => <span className="text-gray-400">Error cargando imagen</span>}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <ImageIcon className="w-16 h-16 mb-2" />
                                        <span className="text-sm">Sin imagen</span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-3">
                                <Label className="text-sm flex items-center gap-2 mb-1">
                                    <ImageIcon className="w-4 h-4 text-gray-700" />
                                    URL de Imagen
                                </Label>
                                <Input
                                    name="urlImagen"
                                    value={formData.urlImagen || ""}
                                    onChange={handleInputChange}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    className="text-sm"
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                <div>
                                    <Label className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-gray-700" />
                                        Ubicación
                                    </Label>
                                    <Input
                                        name="ubicacion"
                                        value={formData.ubicacion}
                                        onChange={handleInputChange}
                                        placeholder="Ej: Piso 2, Zona Norte"
                                    />
                                </div>

                                <div>
                                    <Label className="flex items-center gap-2 mb-2">
                                        <Users className="w-4 h-4 text-gray-700" />
                                        Capacidad
                                    </Label>
                                    <Input
                                        name="capacidad"
                                        type="number"
                                        value={formData.capacidad}
                                        onChange={handleInputChange}
                                        placeholder="Ej: 20"
                                    />
                                </div>

                                <div>
                                    <Label className="flex items-center gap-2 mb-2">
                                        <Package className="w-4 h-4 text-gray-700" />
                                        Equipamiento
                                    </Label>
                                    <Input
                                        name="equipamento"
                                        value={formData.equipamento}
                                        onChange={handleInputChange}
                                        placeholder="Ej: Proyector, Whiteboard"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <Label className="flex items-center gap-2 mb-3 font-semibold">
                                    <Clock className="w-4 h-4 text-gray-700" />
                                    Horario de Disponibilidad
                                </Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm mb-1 block">Hora Inicio</Label>
                                        <Input
                                            name="HoraInicio"
                                            type="time"
                                            value={formData.HoraInicio}
                                            onChange={handleInputChange}
                                            readOnly
                                            className="bg-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm mb-1 block">Hora Fin</Label>
                                        <Input
                                            name="HoraFin"
                                            type="time"
                                            value={formData.HoraFin}
                                            onChange={handleInputChange}
                                            readOnly
                                            className="bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <Label htmlFor="nombre" className="mb-1 block">Nombre del Espacio</Label>
                            <Input
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                placeholder="Ej: Sala de Conferencias A"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="id_tipo" className="mb-1 block">Tipo de Espacio</Label>
                            <Select value={formData.id_tipo.toString()} onValueChange={handleSelectChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROOM_TYPES.map((type, index) => (
                                        <SelectItem key={type} value={(index + 1).toString()}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <Label className="block mb-3 font-semibold">Selecciona Horarios Disponibles</Label>
                        <p className="text-sm text-gray-600 mb-3">Haz clic en la hora de inicio y luego en la hora de fin</p>
                        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        {HOURS.map(hour => (
                                            <td key={hour} className="border border-gray-200 p-0 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleHourClick(hour)}
                                                    className={`w-full h-12 text-xs font-medium transition-all ${
                                                        selectedHours.includes(hour)
                                                        ? "bg-gray-900 text-white"
                                                        : "bg-white hover:bg-gray-100 border border-gray-200"
                                                    }`}
                                                >
                                                    {hour}
                                                </button>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button 
                            className="bg-gray-900 hover:bg-gray-800 text-white" 
                            type="submit"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Espacio
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};