import { ParseError } from '@angular/compiler';
import { Component } from '@angular/core';

@Component({
  selector: 'app-binding-event-component',
  standalone: false,
  styleUrl: './binding-event-component.css',
  templateUrl: './binding-event-component.html',
})
export class BindingEventComponent {
  public hsa: number = 5;
  public hsb: number = 8;
  giaipt(hsa: any, hsb: any, view: HTMLElement) {
    let a = parseFloat(hsa);
    let b = parseFloat(hsb);
    if (a == 0 && b == 0) {
      view.innerHTML = 'Vo so nghiem';
    } else if (a == 0 && b != 0) {
      view.innerHTML = 'Vo nghiem';
    } else {
      view.innerHTML = 'x=' + -b / a;
    }
  }
}
