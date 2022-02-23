import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserContainerPageComponent } from './user-container-page.component';

describe('UserContainerPageComponent', () => {
  let component: UserContainerPageComponent;
  let fixture: ComponentFixture<UserContainerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserContainerPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContainerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
