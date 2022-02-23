import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPulsesPageComponent } from './user-pulses-page.component';

describe('UserPulsesPageComponent', () => {
  let component: UserPulsesPageComponent;
  let fixture: ComponentFixture<UserPulsesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPulsesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPulsesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
