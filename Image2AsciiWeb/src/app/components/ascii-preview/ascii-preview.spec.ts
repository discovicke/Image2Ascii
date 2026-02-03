import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsciiPreview } from './ascii-preview';

describe('AsciiPreview', () => {
  let component: AsciiPreview;
  let fixture: ComponentFixture<AsciiPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsciiPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsciiPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
