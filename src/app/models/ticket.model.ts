import { Space } from "./space.model";
import { User } from "./user.model";
import { Vehicle } from "./vehicle.model";

export interface Ticket {
    id?: string;
    vehicle: Vehicle; // Placa
    state: 'Activo' | 'Cerrado';
    entryDateTime: Number;
    exitDateTime: Number;

}
