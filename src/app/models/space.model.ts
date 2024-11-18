// src/app/models/space.model.ts
export interface Space {
    id?: string; // ID opcional, ya que al crear un espacio nuevo aún no tiene ID
    number: number;
    status: 'Disponible' | 'Ocupado';
    type: 'Normal' | 'Discapacitados' | 'Cubierto' | 'Descubierto' | 'VIP';    
}