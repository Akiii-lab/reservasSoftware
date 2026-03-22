export interface UserLogin {
    id: number;
    correo: string;
    nombre: string;
    idRol: number;
}

export interface LoginResponse {
    token: string;
    user: UserLogin;
}