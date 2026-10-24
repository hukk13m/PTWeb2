import { Component, computed, signal } from '@angular/core';
import { Fashion } from '../classes/Fashion';
import { buildSlug } from '../classes/FashionSlug';
import { FASHION_FALLBACK_IMAGE } from '../classes/FashionImage';
import { FashionAPIService } from '../services/fashion-apiservice';

@Component({
  selector: 'app-fashion-component',
  standalone: false,
  templateUrl: './fashion-component.html',
  styleUrl: './fashion-component.css',
})
export class FashionComponent {
  fashions = signal<Fashion[]>([]);
  errMessage = signal('');
  loading = signal(true);

  // Slug được tính một lần cho cả danh sách để mọi card dùng chung một quy tắc.
  private slugs = computed(() => {
    const list = this.fashions();
    const map = new Map<string, string>();
    list.forEach((fashion) => map.set(String(fashion._id), buildSlug(fashion, list)));
    return map;
  });

  constructor(private _service: FashionAPIService) {
    this._service.getFashions().subscribe({
      next: (data: Fashion[]) => {
        this.fashions.set(data.map((item) => Object.assign(new Fashion(), item)));
        this.loading.set(false);
      },
      error: (err) => {
        this.errMessage.set(err.message || 'Không tải được danh sách Fashion.');
        this.loading.set(false);
      },
    });
  }

  slugOf(fashion: Fashion): string {
    return this.slugs().get(String(fashion._id)) ?? '';
  }

  onImageError(event: Event) {
    const image = event.target as HTMLImageElement;
    if (image.src !== FASHION_FALLBACK_IMAGE) {
      image.src = FASHION_FALLBACK_IMAGE;
    }
  }
}
