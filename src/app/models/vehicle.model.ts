export interface Vehicle {
    id: string;
    plate: string;
    ownerName?: string; // Propietario
    ownerContact?: string; // Telefono del propietario
    vehicleType: string; // Tipo de vehiculo (Moto, camioneta, camion, etc...)
    color: string;
    brand: string; // Marca
    registrationDate: Date; // Fecha de registro
}
