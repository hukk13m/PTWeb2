export interface Fashion {
  _id: string;
  style: string;
  fashion_subject: string;
  fashion_detail: string;
  fashion_image: string;
  created_at: string;
}

export type FashionDraft = Omit<Fashion, '_id' | 'created_at'>;
