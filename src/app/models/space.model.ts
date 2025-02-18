// src/app/models/space.model.ts
export interface Space {
    id?: string; // ID opcional, ya que este se genera en el backEnd
    number: number;
    status: 'Disponible' | 'Ocupado';
    type: 'Normal' | 'Discapacitados' | 'Cubierto' | 'Descubierto' | 'VIP';    
}