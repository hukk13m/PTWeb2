import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FashionApiService } from './fashion-api.service';
import { FashionDraft } from './fashion.model';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-fashion-editor',
  templateUrl: './fashion-editor.component.html',
  styleUrl: './fashion-editor.component.css',
})
export class FashionEditorComponent implements OnInit {
  private readonly api = inject(FashionApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly error = signal('');
  readonly saving = signal(false);
  readonly editingId = signal<string | null>(null);
  fashion: FashionDraft = this.emptyFashion();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.editingId.set(id);
    this.api.getById(id).subscribe({
      next: (fashion) => {
        this.fashion = {
          style: fashion.style,
          fashion_subject: fashion.fashion_subject,
          fashion_detail: fashion.fashion_detail,
          fashion_image: fashion.fashion_image,
        };
      },
      error: (error: Error) => this.error.set(error.message || 'Không tải được Fashion.'),
    });
  }

  updateDetail(event: Event): void {
    this.fashion.fashion_detail = (event.target as HTMLElement).innerHTML;
  }

  format(command: string, value?: string): void {
    document.execCommand(command, false, value);
  }

  save(): void {
    this.error.set('');
    this.saving.set(true);
    const id = this.editingId();
    const request = id
      ? this.api.update(id, this.fashion)
      : this.api.create(this.fashion);

    request.subscribe({
      next: () => this.router.navigate(['/']),
      error: (error: Error) => {
        this.error.set(error.message || 'Không lưu được Fashion.');
        this.saving.set(false);
      },
    });
  }

  private emptyFashion(): FashionDraft {
    return {
      style: '',
      fashion_subject: '',
      fashion_detail: '',
      fashion_image: '',
    };
  }
}
