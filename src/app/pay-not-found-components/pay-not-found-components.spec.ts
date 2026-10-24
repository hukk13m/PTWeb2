import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayNotFoundComponents } from './pay-not-found-components';

describe('PayNotFoundComponents', () => {
  let component: PayNotFoundComponents;
  let fixture: ComponentFixture<PayNotFoundComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayNotFoundComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(PayNotFoundComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
