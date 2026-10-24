import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FashionSearchComponent } from './fashion-search-component';

describe('FashionSearchComponent', () => {
  let component: FashionSearchComponent;
  let fixture: ComponentFixture<FashionSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FashionSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FashionSearchComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
