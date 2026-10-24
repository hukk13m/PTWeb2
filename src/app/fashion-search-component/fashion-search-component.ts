import { Component, signal } from '@angular/core';
import { FashionAPIService } from '../services/fashion-apiservice';
import { Fashion } from '../classes/Fashion';

export interface FashionSearchResult {
  fashion: Fashion;
  similarity: number;
}

export type FashionSearchField = 'fashion_subject' | 'fashion_detail';

@Component({
  selector: 'app-fashion-search-component',
  standalone: false,
  templateUrl: './fashion-search-component.html',
  styleUrl: './fashion-search-component.css',
})
export class FashionSearchComponent {
  keyword = signal('');
  searchField = signal<FashionSearchField>('fashion_subject');
  topN = signal(10);
  results = signal<FashionSearchResult[]>([]);
  errMessage = signal('');
  searched = signal(false);

  private allFashions: Fashion[] = [];

  constructor(private _service: FashionAPIService) {
    this._service.getFashions().subscribe({
      next: (data) => {
        this.allFashions = data;
      },
      error: (err) => {
        this.errMessage.set(err);
      },
    });
  }

  search() {
    const queryTokens = this.tokenize(this.keyword());
    const field = this.searchField();

    const scored: FashionSearchResult[] = this.allFashions.map((fashion) => ({
      fashion,
      similarity: this.jaccard(queryTokens, this.tokenize(String(fashion[field] ?? ''))),
    }));

    // Jaccard Similarity: sort descending
    scored.sort((a, b) => b.similarity - a.similarity);

    const limit = this.topN();
    this.results.set(limit > 0 ? scored.slice(0, limit) : scored);
    this.searched.set(true);
  }

  // Split text into a set of words: lowercase, drop punctuation, ignore empty tokens.
  private tokenize(text: string): Set<string> {
    const tokens = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 0);
    return new Set(tokens);
  }

  // Jaccard Similarity = |A ∩ B| / |A ∪ B|
  private jaccard(a: Set<string>, b: Set<string>): number {
    if (a.size === 0 || b.size === 0) {
      return 0;
    }
    let intersection = 0;
    for (const token of a) {
      if (b.has(token)) {
        intersection++;
      }
    }
    const union = a.size + b.size - intersection;
    return union === 0 ? 0 : intersection / union;
  }

  // Background color band: [0.75 -> 1] pink, [0.5 -> 0.75) yellow, < 0.5 gray
  similarityClass(similarity: number): string {
    if (similarity >= 0.75) {
      return 'similarity-high';
    }
    if (similarity >= 0.5) {
      return 'similarity-medium';
    }
    return 'similarity-low';
  }

  formatSimilarity(similarity: number): string {
    return similarity.toFixed(2);
  }
}
