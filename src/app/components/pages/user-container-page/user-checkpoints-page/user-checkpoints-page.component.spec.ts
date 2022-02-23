import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCheckpointsPageComponent } from './user-checkpoints-page.component';

describe('UserCheckpointsPageComponent', () => {
  let component: UserCheckpointsPageComponent;
  let fixture: ComponentFixture<UserCheckpointsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCheckpointsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCheckpointsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
