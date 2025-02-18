import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  isValidNumber(value: any): boolean {
    return !isNaN(value) && Number(value) > 0;
  }

  isValidStatus(status: string): boolean {
    return ['Disponible', 'Ocupado'].includes(status);
  }

  isValidType(type: string): boolean {
    return ['Normal', 'VIP', 'Moto'].includes(type);
  }
}
