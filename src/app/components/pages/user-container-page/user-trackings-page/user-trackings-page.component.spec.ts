import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTrackingsPageComponent } from './user-trackings-page.component';

describe('UserTrackingsPageComponent', () => {
  let component: UserTrackingsPageComponent;
  let fixture: ComponentFixture<UserTrackingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTrackingsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTrackingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
