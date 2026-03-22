export interface AvialableResponse {
    roomId: number;
    fecha: string;
    franjasReservadas: ReservationsFringe[];
    totalReservas: number;
}

export interface ReservationsFringe {
    horaInicio: string;
    horaFin: string;
    estado: string;
}

export interface ReservationHistory {
    fecha: string;
    horaInicio: string;
    horaFin: string;
    estado: string;
    id: number;
    idEspacioNavigation: EspacioNavigation;
    idEstadoNavigation: EstadoNavigation;
}

export interface EspacioNavigation {
    id: number;
    nombre: string;
    ubicacion: string;
    horaInicial: string;
    horaFinal: string;
    urlImagen?: string;
}

export interface EstadoNavigation {
    id: number;
    nombre: string;
}

export interface Reservations {
    id: number;
    idUsuario: number;
    idEspacio: number;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    idEstado: string;
    idEspacioNavigation: EspacioNavigation;
    idEstadoNavigation: EstadoNavigation;
    notificaciones?: any[];
}