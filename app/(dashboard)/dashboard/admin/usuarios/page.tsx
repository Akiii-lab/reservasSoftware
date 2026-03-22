"use client";
import { config } from "@/config/config";
import { useUserStore } from "@/persistence/userPersistence";
import { Reservations } from "@/types/reserve";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Eye, Calendar, Clock, MapPin } from "lucide-react";

export default function ManagementUsuarios() {

    const { user, token, _hasHydrated } = useUserStore();
    const [reservations, setReservations] = useState<Reservations[]>([]);
    const [selectedReservation, setSelectedReservation] = useState<Reservations | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    useEffect(() => {
        if (!_hasHydrated) return;
        if (!user || !token) window.location.href = "/auth/login";
        fetchReservations();
    }, [_hasHydrated]);

    const fetchReservations = async () => {
        try {
            const res = await fetch(config.ApiUrl + "/Reserve", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            const data: Reservations[] = await res.json();
            setReservations(data);
        } catch (error) {
            toast.error("Error al obtener las reservas");
            console.error("Error fetching reservations:", error);
        }
    }

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            const res = await fetch(config.ApiUrl + `/Reserve/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ idEstado: status})
            });

            if (!res.ok) {
                throw new Error("Error updating reservation status");
            }

            toast.success("Estado de reserva actualizado");
            setShowDialog(false);
            fetchReservations();
        } catch (error) {
            toast.error("Error al actualizar el estado de la reserva");
            console.error("Error updating reservation status:", error);
        }
    }

    const handleViewDetails = (reservation: Reservations) => {
        setSelectedReservation(reservation);
        setSelectedStatus(reservation.idEstado.toString());
        setShowDialog(true);
    }

    const getStatusColor = (estado: string) => {
        switch(estado?.toLowerCase()) {
            case 'aprobado': return 'bg-green-500';
            case 'pendiente': return 'bg-yellow-500';
            case 'rechazado': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Settings className="w-8 h-8 text-gray-900" />
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Gestión de Solicitudes de Reserva
                    </h1>
                </div>
                <p className="text-gray-600">Administra y aprueba las solicitudes de reserva de espacios</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Espacio</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reservations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-500">
                                    No hay reservas
                                </TableCell>
                            </TableRow>
                        ) : (
                            reservations.map((reservation) => (
                                <TableRow key={reservation.id}>
                                    <TableCell className="font-medium">#{reservation.id}</TableCell>
                                    <TableCell>{reservation.idEspacioNavigation?.nombre || "N/A"}</TableCell>
                                    <TableCell>Usuario #{reservation.idUsuario}</TableCell>
                                    <TableCell>{new Date(reservation.fecha).toLocaleDateString('es-ES')}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(reservation.idEstadoNavigation?.nombre)}>
                                            {reservation.idEstadoNavigation?.nombre || "N/A"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => handleViewDetails(reservation)}
                                            className="hover:bg-gray-100 transition-colors"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Ver
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <Eye className="w-6 h-6 text-gray-900" />
                            <DialogTitle className="text-2xl font-semibold text-gray-900">
                                Detalles de la Reserva #{selectedReservation?.id}
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                    {selectedReservation && (
                        <div className="space-y-6">
                            {selectedReservation.idEspacioNavigation?.urlImagen && (
                                <div className="w-full aspect-video bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
                                    <img
                                        src={selectedReservation.idEspacioNavigation.urlImagen}
                                        alt={selectedReservation.idEspacioNavigation.nombre}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="w-4 h-4 text-gray-700" />
                                        <Label className="font-semibold text-sm">Espacio</Label>
                                    </div>
                                    <p className="text-gray-700 mt-1">{selectedReservation.idEspacioNavigation?.nombre}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="w-4 h-4 text-gray-700" />
                                        <Label className="font-semibold text-sm">Usuario</Label>
                                    </div>
                                    <p className="text-gray-700 mt-1">ID: {selectedReservation.idUsuario}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPin className="w-4 h-4 text-gray-700" />
                                    <Label className="font-semibold text-sm">Ubicación</Label>
                                </div>
                                <p className="text-gray-700 mt-1">
                                    {selectedReservation.idEspacioNavigation?.ubicacion || "No especificada"}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="w-4 h-4 text-gray-700" />
                                        <Label className="font-semibold text-sm">Fecha</Label>
                                    </div>
                                    <p className="text-gray-700 mt-1">
                                        {new Date(selectedReservation.fecha).toLocaleDateString('es-ES', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <Label className="font-semibold text-sm">Estado Actual</Label>
                                    <Badge className={`mt-1 ${getStatusColor(selectedReservation.idEstadoNavigation?.nombre)}`}>
                                        {selectedReservation.idEstadoNavigation?.nombre}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className="w-4 h-4 text-gray-700" />
                                        <Label className="font-semibold text-sm">Hora de Inicio</Label>
                                    </div>
                                    <p className="text-gray-700 mt-1">{selectedReservation.horaInicio}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className="w-4 h-4 text-gray-700" />
                                        <Label className="font-semibold text-sm">Hora de Fin</Label>
                                    </div>
                                    <p className="text-gray-700 mt-1">{selectedReservation.horaFin}</p>
                                </div>
                            </div>

                            {selectedReservation.idEspacioNavigation && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className="w-4 h-4 text-gray-700" />
                                        <Label className="font-semibold text-sm">Horario del Espacio</Label>
                                    </div>
                                    <p className="text-gray-700 mt-1">
                                        {selectedReservation.idEspacioNavigation.horaInicial} - {selectedReservation.idEspacioNavigation.horaFinal}
                                    </p>
                                </div>
                            )}

                            <div className="border-t pt-4 mt-4">
                                <Label className="font-semibold text-sm mb-3 block text-gray-700">Cambiar Estado de la Reserva</Label>
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona un estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Aprobado</SelectItem>
                                        <SelectItem value="2">Rechazado</SelectItem>
                                        <SelectItem value="3">Pendiente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setShowDialog(false)}>
                            Cancelar
                        </Button>
                        <Button 
                            onClick={() => selectedReservation && handleUpdateStatus(selectedReservation.id, selectedStatus)}
                            disabled={!selectedStatus}
                            className="bg-gray-900 hover:bg-gray-800 text-white"
                        >
                            Actualizar Estado
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}