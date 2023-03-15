import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompilePhraseComponent } from './compile-phrase.component';

describe('CompilePhraseComponent', () => {
  let component: CompilePhraseComponent;
  let fixture: ComponentFixture<CompilePhraseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompilePhraseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompilePhraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
