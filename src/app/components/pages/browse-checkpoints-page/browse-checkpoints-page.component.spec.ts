import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseCheckpointsPageComponent } from './browse-checkpoints-page.component';

describe('BrowseCheckpointsPageComponent', () => {
  let component: BrowseCheckpointsPageComponent;
  let fixture: ComponentFixture<BrowseCheckpointsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseCheckpointsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseCheckpointsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
