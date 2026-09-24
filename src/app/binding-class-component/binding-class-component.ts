import { Component } from '@angular/core';

@Component({
  selector: 'app-binding-class-component',
  standalone: false,
  styleUrl: './binding-class-component.css',
  templateUrl: './binding-class-component.html',
})
export class BindingClassComponent {
  isSaved: boolean = false;
  isActive: boolean = true;

  toogleSaveState() {
    this.isSaved = !this.isSaved;
  }
}
