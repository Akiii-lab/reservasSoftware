export interface Rooms {
    id: number;
    nombre: string;
    capacidad: number;
    equipamento: string; 
    HoraInicio: string;
    HoraFin: string;
    ubicacion: string;
    id_tipo: number;
    urlImagen?: string;
    idEstado: number;
}

export interface CreateRoom {
    nombre: string;
    capacidad: number;
    equipamento: string; 
    HoraInicio: string;
    HoraFin: string;
    ubicacion: string;
    id_tipo: number;
    urlImagen?: string;
}

export interface CreateReservation {
    idRoom: number;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    idUsuario?: number;
}

export type RoomType = "Sala de reuniones" | "Auditorio" | "Espacio abierto" | "Salón";