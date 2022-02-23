import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsePulsesPageComponent } from './browse-pulses-page.component';

describe('BrowsePulsesPageComponent', () => {
  let component: BrowsePulsesPageComponent;
  let fixture: ComponentFixture<BrowsePulsesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowsePulsesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsePulsesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
