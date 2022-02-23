import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseConversationsPageComponent } from './browse-conversations-page.component';

describe('BrowseConversationsPageComponent', () => {
  let component: BrowseConversationsPageComponent;
  let fixture: ComponentFixture<BrowseConversationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseConversationsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseConversationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
