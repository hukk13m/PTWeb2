import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FashionApiService } from './fashion-api.service';
import { Fashion } from './fashion.model';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-fashion-detail',
  templateUrl: './fashion-detail.component.html',
  styleUrl: './fashion-detail.component.css',
})
export class FashionDetailComponent implements OnInit {
  private readonly api = inject(FashionApiService);
  private readonly route = inject(ActivatedRoute);
  readonly fashion = signal<Fashion | null>(null);
  readonly error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Không tìm thấy mã Fashion.');
      return;
    }

    this.api.getById(id).subscribe({
      next: (fashion) => this.fashion.set(fashion),
      error: (error: Error) => this.error.set(error.message || 'Không tải được Fashion.'),
    });
  }
}
