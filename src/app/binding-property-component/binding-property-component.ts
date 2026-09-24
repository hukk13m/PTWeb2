import { Component } from '@angular/core';

@Component({
  selector: 'app-binding-property-component',
  standalone: false,
  styleUrl: './binding-property-component.css',
  templateUrl: './binding-property-component.html',
})
export class BindingPropertyComponent {
  public name: string = 'Nguyen Dinh Huy';
  public email: string = 'dinhhuy27072006@gmail.com';
  public nameid: string = 'K244111403';
  public emailid: string = '123456789';
  public isDisabled: boolean = false;
  public hello: string = 'Hey! how is going?';
}
