import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceCustomer {
  private readonly _url = '/assets/data/customers.json';

  constructor(private readonly _http: HttpClient) {}

  getCustomerList(): Observable<any[]> {
    return this._http.get<any[]>(this._url);
  }
}
