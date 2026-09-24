import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceProductImageEventDetailComponent } from './service-product-image-event-detail';

describe('ServiceProductImageEventDetail', () => {
  let component: ServiceProductImageEventDetailComponent;
  let fixture: ComponentFixture<ServiceProductImageEventDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceProductImageEventDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceProductImageEventDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
