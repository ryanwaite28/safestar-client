import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWatchesPageComponent } from './user-watches-page.component';

describe('UserWatchesPageComponent', () => {
  let component: UserWatchesPageComponent;
  let fixture: ComponentFixture<UserWatchesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWatchesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWatchesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
