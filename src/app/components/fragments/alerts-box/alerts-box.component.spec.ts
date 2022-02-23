import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsBoxComponent } from './alerts-box.component';

describe('AlertsBoxComponent', () => {
  let component: AlertsBoxComponent;
  let fixture: ComponentFixture<AlertsBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertsBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
