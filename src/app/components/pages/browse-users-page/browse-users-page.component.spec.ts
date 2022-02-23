import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseUsersPageComponent } from './browse-users-page.component';

describe('BrowseUsersPageComponent', () => {
  let component: BrowseUsersPageComponent;
  let fixture: ComponentFixture<BrowseUsersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseUsersPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseUsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
