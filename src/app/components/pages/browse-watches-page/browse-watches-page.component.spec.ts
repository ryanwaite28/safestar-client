import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseWatchesPageComponent } from './browse-watches-page.component';

describe('BrowseWatchesPageComponent', () => {
  let component: BrowseWatchesPageComponent;
  let fixture: ComponentFixture<BrowseWatchesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseWatchesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseWatchesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
