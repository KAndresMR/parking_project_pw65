export interface Tariff {
    id: string;
    type: string;        // Tipo de tarifa (por hora, por día, etc.)
    value: number;       // Valor de la tarifa
    description?: string; // Descripción opcional
  }
  