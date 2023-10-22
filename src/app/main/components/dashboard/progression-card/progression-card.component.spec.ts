import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressionCardComponent } from './progression-card.component';

describe('ProgressionCardComponent', () => {
  let component: ProgressionCardComponent;
  let fixture: ComponentFixture<ProgressionCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressionCardComponent]
    });
    fixture = TestBed.createComponent(ProgressionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
