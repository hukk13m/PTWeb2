import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FashionApiService } from './fashion-api.service';
import { Fashion } from './fashion.model';

@Component({
  imports: [RouterLink],
  selector: 'app-fashion-home',
  templateUrl: './fashion-home.component.html',
  styleUrl: './fashion-home.component.css',
})
export class FashionHomeComponent implements OnInit {
  private readonly api = inject(FashionApiService);
  private readonly allFashions = signal<Fashion[]>([]);
  readonly fashions = signal<Fashion[]>([]);
  readonly styles = computed(() => [...new Set(this.allFashions().map((item) => item.style))].sort());
  readonly groups = computed(() => {
    const grouped = new Map<string, Fashion[]>();
    for (const fashion of this.fashions()) {
      const group = grouped.get(fashion.style) ?? [];
      group.push(fashion);
      grouped.set(fashion.style, group);
    }
    return [...grouped.entries()];
  });
  readonly selectedStyle = signal('');
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.api.getAll().subscribe({
      next: (fashions) => {
        this.allFashions.set(fashions);
        this.fashions.set(fashions);
        this.loading.set(false);
      },
      error: (error: Error) => {
        this.error.set(error.message || 'Không tải được Fashion.');
        this.loading.set(false);
      },
    });
  }

  filterByStyle(style: string): void {
    this.selectedStyle.set(style);
    this.loading.set(true);
    this.error.set('');
    this.api.getAll(style || undefined).subscribe({
      next: (fashions) => {
        this.fashions.set(fashions);
        this.loading.set(false);
      },
      error: (error: Error) => {
        this.error.set(error.message || 'Không lọc được Fashion.');
        this.loading.set(false);
      },
    });
  }

  onStyleChange(event: Event): void {
    const select = event.target;
    if (select instanceof HTMLSelectElement) {
      this.filterByStyle(select.value);
    }
  }
}
