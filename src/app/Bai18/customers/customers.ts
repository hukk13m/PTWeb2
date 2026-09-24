import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ServiceCustomer } from '../services/service-customer';

@Component({
  selector: 'app-customers',
  standalone: false,
  styleUrl: './customers.css',
  templateUrl: './customers.html',
})
export class Customers implements OnInit {
  public categories: any[] = [];
  public errorMessage: string = '';

  constructor(
    private readonly customerService: ServiceCustomer,
    private readonly cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.customerService.getCustomerList().subscribe({
      next: (data: any[]) => {
        this.categories = data.map((item: any) => ({
          CustomerTypeID: item.CustomerTypeId,
          CustomerTypeName: item.CustomterTypeName,
          Customer: item.Customers,
        }));
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
