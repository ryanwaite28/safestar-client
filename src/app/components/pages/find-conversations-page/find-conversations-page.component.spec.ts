import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindConversationsPageComponent } from './find-conversations-page.component';

describe('FindConversationsPageComponent', () => {
  let component: FindConversationsPageComponent;
  let fixture: ComponentFixture<FindConversationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindConversationsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindConversationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
