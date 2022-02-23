import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckpointCardComponent } from './checkpoint-card.component';

describe('CheckpointCardComponent', () => {
  let component: CheckpointCardComponent;
  let fixture: ComponentFixture<CheckpointCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckpointCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckpointCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
