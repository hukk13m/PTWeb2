import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceCatalogImageEvent } from './service-catalog-image-event';

describe('ServiceCatalogImageEvent', () => {
  let component: ServiceCatalogImageEvent;
  let fixture: ComponentFixture<ServiceCatalogImageEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceCatalogImageEvent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceCatalogImageEvent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
