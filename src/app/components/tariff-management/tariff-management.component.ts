import { Component, OnInit } from '@angular/core';
import { Tariff } from '../../models/tariff.model';
import { TariffService } from '../../services/tariff.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-tariff-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tariff-management.component.html',
  styleUrl: './tariff-management.component.scss'
})
export class TariffManagementComponent implements OnInit{

  tariffs: Tariff[] = [];
  newTariff: Tariff = { id: '', type: '', value: 0, description: '' };
  editMode = false;
  messageVisible: boolean = false;


  constructor(private tariffService: TariffService) {}

  ngOnInit(): void {
    this.tariffService.getTariffs().then(tariffs => {
      this.tariffs = tariffs;      
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.tariffService.updateTariff(this.newTariff).then(() => {
        this.resetForm();
      });
    } else {
      this.tariffService.addTariff(this.newTariff).then(() => {
        this.messageVisible = true;
        setTimeout(() => {
          this.messageVisible = false
        }, 3000 )

        this.resetForm();
      });
      this.loadTariff()
    }
  }

  editTariff(tariff: Tariff) {
    this.newTariff = { ...tariff };
    this.editMode = true;
  }

  async deleteTariff(tariff: Tariff) {
    if(!tariff.id) {
      return;
    }
    await this.tariffService.deleteTariff(tariff.id.toString());
    this.loadTariff()
  }

  loadTariff() {
    this.tariffService.getTariffs().then(tariffs => {
      this.tariffs = tariffs;      
    });
  }

  resetForm() {
    this.newTariff = { id: '', type: '', value: 0, description: '' };
    this.editMode = false;
  }

}
