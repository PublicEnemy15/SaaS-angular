import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tier } from './tier';

describe('Tier', () => {
  let component: Tier;
  let fixture: ComponentFixture<Tier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tier]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
