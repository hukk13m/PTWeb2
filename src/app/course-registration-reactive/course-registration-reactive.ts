import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-course-registration-reactive',
  standalone: false,
  styleUrl: './course-registration-reactive.css',
  templateUrl: './course-registration-reactive.html',
})
export class CourseRegistrationReactive {
  public regForm: FormGroup = new FormGroup({
    name: new FormControl('Nguyen Thi Long Lanh', [
      Validators.required,
      Validators.minLength(3),
      this.customerValidator,
    ]),
    email: new FormControl('longlanh@st.uel.edu.vn', [Validators.required, Validators.email]),
    password: new FormControl('123', [Validators.required, Validators.minLength(8)]),
    confirmPass: new FormControl('123', [Validators.required, Validators.minLength(8)]),
  });
  setDefaultValues() {
    this.regForm.patchValue({
      name: 'Trần Duy Thanh',
      email: 'thanhtd@uel.edu.vn',
    });
  }
  customerValidator(control: AbstractControl): { [key: string]: any } | null {
    const matchName = /[@#$%^&]/g.test(control.value);
    return matchName ? { namenoMatch: { value: control.value } } : null;
  }
}
