import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindWatchesPageComponent } from './find-watches-page.component';

describe('FindWatchesPageComponent', () => {
  let component: FindWatchesPageComponent;
  let fixture: ComponentFixture<FindWatchesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindWatchesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindWatchesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
