"use client";

import { config } from "@/config/config";
import { useUserStore } from "@/persistence/userPersistence";
import { ReservationHistory } from "@/types/reserve";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ClipboardList, Calendar, Clock, MapPin } from "lucide-react";

export default function MyReservationsPage() {
    const { user, token, _hasHydrated } = useUserStore();
    const [reservations, setReservations] = useState<ReservationHistory[]>([]);
    const [selectedReservation, setSelectedReservation] = useState<ReservationHistory | null>(null);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        if (!_hasHydrated) return;
        if(!user || !token) window.location.href = "/auth/login";
        fetchReservations();
    }, [_hasHydrated]);

    const fetchReservations = async () => {
        try {
            const res = await fetch(config.ApiUrl + `/Reserve/myreserves/${user?.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data : ReservationHistory[] = await res.json();
            setReservations(data);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    }

    const handleRowClick = (reservation: ReservationHistory) => {
        setSelectedReservation(reservation);
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
                    <ClipboardList className="w-8 h-8 text-gray-900" />
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Mis Reservas
                    </h1>
                </div>
                <p className="text-gray-600">Consulta el historial de tus reservaciones</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Espacio</TableHead>
                            <TableHead>Ubicación</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reservations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-gray-500">
                                    No tienes reservas
                                </TableCell>
                            </TableRow>
                        ) : (
                            reservations.map((reservation) => (
                                <TableRow 
                                    key={reservation.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleRowClick(reservation)}
                                >
                                    <TableCell className="font-medium">{reservation.idEspacioNavigation?.nombre}</TableCell>
                                    <TableCell>{reservation.idEspacioNavigation?.ubicacion || "N/A"}</TableCell>
                                    <TableCell>{new Date(reservation.fecha).toLocaleDateString('es-ES')}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(reservation.idEstadoNavigation?.nombre || '')}>
                                            {reservation.idEstadoNavigation?.nombre || 'N/A'}
                                        </Badge>
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
                        <DialogTitle>Detalles de la Reserva</DialogTitle>
                    </DialogHeader>
                    {selectedReservation && (
                        <div className="space-y-4">
                            {selectedReservation.idEspacioNavigation?.urlImagen && (
                                <div className="w-full aspect-video bg-gray-200 border-2 border-gray-300 rounded overflow-hidden">
                                    <img
                                        src={selectedReservation.idEspacioNavigation.urlImagen}
                                        alt={selectedReservation.idEspacioNavigation.nombre}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div>
                                <Label className="font-semibold text-sm">Espacio</Label>
                                <p className="text-gray-700 mt-1">{selectedReservation.idEspacioNavigation?.nombre}</p>
                            </div>

                            <div>
                                <Label className="font-semibold text-sm">Ubicación</Label>
                                <p className="text-gray-700 mt-1">
                                    {selectedReservation.idEspacioNavigation?.ubicacion || "No especificada"}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="font-semibold text-sm">Fecha</Label>
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
                                    <Label className="font-semibold text-sm">Estado</Label>
                                    <Badge className={`mt-1 ${getStatusColor(selectedReservation.idEstadoNavigation?.nombre || '')}`}>
                                        {selectedReservation.idEstadoNavigation?.nombre || 'N/A'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="font-semibold text-sm">Hora de Inicio</Label>
                                    <p className="text-gray-700 mt-1">{selectedReservation.horaInicio}</p>
                                </div>
                                <div>
                                    <Label className="font-semibold text-sm">Hora de Fin</Label>
                                    <p className="text-gray-700 mt-1">{selectedReservation.horaFin}</p>
                                </div>
                            </div>

                            {selectedReservation.idEspacioNavigation && (
                                <div>
                                    <Label className="font-semibold text-sm">Horario del Espacio</Label>
                                    <p className="text-gray-700 mt-1">
                                        {selectedReservation.idEspacioNavigation.horaInicial} - {selectedReservation.idEspacioNavigation.horaFinal}
                                    </p>
                                </div>
                            )}

                            <div>
                                <Label className="font-semibold text-sm">ID de Reserva</Label>
                                <p className="text-gray-700 mt-1">#{selectedReservation.id}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}