import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseRegistrationReactive } from './course-registration-reactive';

describe('CourseRegistrationReactive', () => {
  let component: CourseRegistrationReactive;
  let fixture: ComponentFixture<CourseRegistrationReactive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourseRegistrationReactive],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseRegistrationReactive);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
