import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConversationsPageComponent } from './user-conversations-page.component';

describe('UserConversationsPageComponent', () => {
  let component: UserConversationsPageComponent;
  let fixture: ComponentFixture<UserConversationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserConversationsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConversationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
