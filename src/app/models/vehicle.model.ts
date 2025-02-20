import { Space } from "./space.model";
import { User } from "./user.model";

export interface Vehicle {
    id?: string;
    plate: string;
    ownerContact?: string; // Telefono del propietario
    vehicleType: string; // Tipo de vehiculo (Moto, camioneta, camion, etc...)
    color: string;
    brand: string; // Marca
    registrationDate: Date; // Fecha de registro
    space?: Space;
    user?: User;
}
