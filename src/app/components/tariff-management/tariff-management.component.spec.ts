import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffManagementComponent } from './tariff-management.component';

describe('TariffManagementComponent', () => {
  let component: TariffManagementComponent;
  let fixture: ComponentFixture<TariffManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TariffManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TariffManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
