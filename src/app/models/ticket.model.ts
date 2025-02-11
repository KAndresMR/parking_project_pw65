export interface Ticket {
    id: number;
    placa: number;
    entryDateTime: Date;
    exitDateTime: Date;
    spaceId: number;
    state: string; // Propietario
}
