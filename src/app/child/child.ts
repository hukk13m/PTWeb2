import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  standalone: false,
  styleUrl: './child.css',
  templateUrl: './child.html',
})
export class ChildComponent {
  // Decorator to receive data from parent
  @Input() receivedData: string = '';
}
