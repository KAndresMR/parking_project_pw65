export interface Vehicle {
    id: string;
    vehicleId: string; // Id del vehiculo
    entryDateTime: Date; // Entrada del vehiculo
    exitDateTime: Date; // Salida del vehiculo
    assignedSpace: string; // Espacio asignado
    status: string; // Estado (Ingresado, Retirado)
    duration: number; // Tiempo total de duracion del vehiculo
}
