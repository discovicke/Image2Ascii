import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPanel } from './settings-panel';

describe('SettingsPanel', () => {
  let component: SettingsPanel;
  let fixture: ComponentFixture<SettingsPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
