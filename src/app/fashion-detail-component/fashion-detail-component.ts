import { Component, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Fashion } from '../classes/Fashion';
import { FASHION_FALLBACK_IMAGE } from '../classes/FashionImage';
import { FashionAPIService } from '../services/fashion-apiservice';

@Component({
  selector: 'app-fashion-detail-component',
  standalone: false,
  templateUrl: './fashion-detail-component.html',
  styleUrl: './fashion-detail-component.css',
})
export class FashionDetailComponent {
  fashion = signal<Fashion | null>(null);
  slug = signal('');
  errMessage = signal('');
  loading = signal(true);

  constructor(
    private _service: FashionAPIService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    // Đọc slug trên URL. Subscribe paramMap để đổi Fashion khi điều hướng
    // từ trang chi tiết này sang trang chi tiết khác mà không cần tải lại app.
    this._route.paramMap.subscribe((params: ParamMap) => {
      const slug = params.get('slug') ?? '';
      this.slug.set(slug);
      this.loadFashion(slug);
    });
  }

  loadFashion(slug: string) {
    this.loading.set(true);
    this.fashion.set(null);
    this.errMessage.set('');

    if (!slug) {
      this.errMessage.set('Không tìm thấy sản phẩm');
      this.loading.set(false);
      return;
    }

    this._service.getFashionBySlug(slug).subscribe({
      next: (data) => {
        if (!data) {
          this.errMessage.set('Không tìm thấy sản phẩm');
        } else {
          this.fashion.set(Object.assign(new Fashion(), data));
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.errMessage.set(err.message || 'Không tìm thấy sản phẩm');
        this.loading.set(false);
      },
    });
  }

  goBack() {
    this._router.navigate(['/fashion']);
  }

  onImageError(event: Event) {
    const image = event.target as HTMLImageElement;
    if (image.src !== FASHION_FALLBACK_IMAGE) {
      image.src = FASHION_FALLBACK_IMAGE;
    }
  }
}
