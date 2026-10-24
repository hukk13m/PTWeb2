import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FashionApiService } from './fashion-api.service';
import { Fashion } from './fashion.model';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-fashion-list',
  templateUrl: './fashion-list.component.html',
  styleUrl: './fashion-list.component.css',
})
export class FashionListComponent implements OnInit {
  private readonly api = inject(FashionApiService);
  readonly fashions = signal<Fashion[]>([]);
  readonly error = signal('');
  readonly loading = signal(true);

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.getAll().subscribe({
      next: (fashions) => {
        this.fashions.set(fashions);
        this.loading.set(false);
      },
      error: (error: Error) => {
        this.error.set(error.message || 'Không tải được danh sách Fashion.');
        this.loading.set(false);
      },
    });
  }

  deleteFashion(fashion: Fashion): void {
    if (!window.confirm(`Bạn chắc chắn muốn xóa "${fashion.fashion_subject}"?`)) {
      return;
    }

    this.error.set('');
    this.api.delete(fashion._id).subscribe({
      next: () => this.reload(),
      error: (error: Error) => this.error.set(error.message || 'Không xóa được Fashion.'),
    });
  }
}
