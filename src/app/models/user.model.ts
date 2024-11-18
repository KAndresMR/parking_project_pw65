export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'cliente' | 'administrador';
    state: 'Contrato' | 'N/D';
  }
  